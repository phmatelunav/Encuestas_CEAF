import React, { useState, useEffect } from 'react';
import {
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonButton, IonInput, IonSelect, IonSelectOption, IonText, IonSpinner, IonIcon
} from '@ionic/react';
import { scanOutline, closeCircle } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CapacitorPluginMlKitTextRecognition } from '@pantrist/capacitor-plugin-ml-kit-text-recognition';
import { parseProgramDeRiegoOCR } from '../utils/ocrParser';
import { useSurveyContext } from '../context/SurveyContext';
import { SurveyTemplate, SurveyResponse } from '../types';

export const SurveyForm: React.FC = () => {
    const { templates, interviewees, responses, addResponse, updateResponse } = useSurveyContext();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [selectedIntervieweeId, setSelectedIntervieweeId] = useState<string>('');
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [photos, setPhotos] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [existingResponseId, setExistingResponseId] = useState<string | null>(null);

    const template = templates.find(t => t.id === selectedTemplateId);

    // Auto-Cargar respuestas previas
    useEffect(() => {
        if (selectedTemplateId && selectedIntervieweeId) {
            const previousResponse = responses.find(r => 
                r.templateId === selectedTemplateId && r.intervieweeId === selectedIntervieweeId
            );
            if (previousResponse) {
                setExistingResponseId(previousResponse.id);
                setAnswers(previousResponse.answers || {});
                setPhotos(previousResponse.photos || []);
            } else {
                setExistingResponseId(null);
                setAnswers({});
                setPhotos([]);
            }
        }
    }, [selectedTemplateId, selectedIntervieweeId, responses]);

    const handleDeletePhoto = (indexToDelete: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== indexToDelete));
    };

    const handleAnswerChange = (questionId: string, value: string | number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleScanDocument = async () => {
        try {
            setIsScanning(true);
            const photo = await Camera.getPhoto({
                quality: 100,
                allowEditing: true,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera
            });

            if (photo.base64String && template) {
                // Remove prefix if existing (data:image/jpeg;base64,)
                const base64Data = photo.base64String.includes(',') 
                    ? photo.base64String.split(',')[1] 
                    : photo.base64String;

                const result = await CapacitorPluginMlKitTextRecognition.detectText({
                    base64Image: base64Data
                });

                const parsed = parseProgramDeRiegoOCR(result.text);

                // Map parsed data to template questions
                const newAnswers: Record<string, string | number> = { ...answers };
                
                template.questions.forEach((q, index) => {
                    const qNumber = index + 1;
                    // Question 7 is text, other are multiple choice
                    if (qNumber === 7 && parsed.q7) {
                        newAnswers[q.id] = parsed.q7;
                    } else if (qNumber >= 1 && qNumber <= 6) {
                        const parsedOptLetter = (parsed as any)[`q${qNumber}`];
                        if (parsedOptLetter && q.options) {
                            // Find the option that starts with this letter (e.g. "a. No se ajustan...")
                            const matchedOpt = q.options.find(opt => opt.toLowerCase().startsWith(parsedOptLetter));
                            if (matchedOpt) {
                                newAnswers[q.id] = matchedOpt;
                            }
                        }
                    }
                });

                // Also we could map Nombre and Comuna to text inputs if they exist as first 2 questions.
                template.questions.forEach(q => {
                    if (q.text.toLowerCase().includes('nombre') && parsed.nombre) newAnswers[q.id] = parsed.nombre;
                    if (q.text.toLowerCase().includes('comuna') && parsed.comuna) newAnswers[q.id] = parsed.comuna;
                });

                setAnswers(newAnswers);
                setPhotos(prev => [...prev, base64Data]); // Also save the photo globally as requested
                alert('Escaneo procesado correctamente. Revisa los resultados antes de guardar.');
            }
        } catch (error: any) {
            console.error('Error in scanning:', error);
            if (error.message !== 'User cancelled photos app') {
                alert('Error al procesar la imagen con OCR.');
            }
        } finally {
            setIsScanning(false);
        }
    };

    const handleAddPhoto = async () => {
        try {
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera
            });
            if (photo.base64String) {
                // Ensure plain base64 string
                const base64Data = photo.base64String.includes(',') 
                    ? photo.base64String.split(',')[1] 
                    : photo.base64String;
                setPhotos(prev => [...prev, base64Data]);
            }
        } catch (error) {
            console.warn('Cámara cancelada o error', error);
        }
    };

    const handleSubmit = async () => {
        if (!template) return;
        if (!selectedIntervieweeId) {
            alert('Por favor, selecciona al usuario/entrevistado.');
            return;
        }

        // Validate that all questions are answered ONLY IF no photos are attached
        if (photos.length === 0) {
            for (const q of template.questions) {
                if (answers[q.id] === undefined || answers[q.id] === '') {
                    alert(`Por favor, responde la pregunta: "${q.text}" o adjunta al menos una fotografía.`);
                    return;
                }
            }
        }

        setIsSaving(true);
        let location;
        try {
            const position = await Geolocation.getCurrentPosition();
            location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
        } catch (error) {
            console.warn('Error obtaining location', error);
            // Si el usuario deniega o hay error, podemos guardar igual sin GPS o mostrar alert.
        }

        const response: SurveyResponse = {
            id: existingResponseId || nanoid(),
            templateId: template.id,
            intervieweeId: selectedIntervieweeId,
            answers,
            timestamp: new Date().toISOString(),
            ...(location && { location }),
            ...(photos.length > 0 && { photos })
        };

        if (existingResponseId) {
            updateResponse(existingResponseId, response);
        } else {
            addResponse(response);
        }

        setAnswers({});
        setPhotos([]);
        setSelectedTemplateId('');
        setSelectedIntervieweeId('');
        setExistingResponseId(null);
        setIsSaving(false);
        alert(existingResponseId ? '¡Respuesta actualizada correctamente!' : '¡Encuesta guardada localmente!');
    };

    if (templates.length === 0) {
        return (
            <IonCard>
                <IonCardContent>
                    <IonText color="medium">Crea una plantilla primero para tomar datos.</IonText>
                </IonCardContent>
            </IonCard>
        );
    }

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Toma de Datos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonItem>
                    <IonLabel position="stacked">Seleccionar Encuesta</IonLabel>
                    <IonSelect
                        value={selectedTemplateId}
                        onIonChange={e => {
                            setSelectedTemplateId(e.detail.value);
                            setAnswers({}); // reset answers
                        }}
                    >
                        {templates.map(t => (
                            <IonSelectOption key={t.id} value={t.id}>{t.title}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Seleccionar Usuario / Entrevistado</IonLabel>
                    <IonSelect
                        value={selectedIntervieweeId}
                        onIonChange={e => setSelectedIntervieweeId(e.detail.value)}
                        placeholder="Elija la persona..."
                    >
                        {[...interviewees]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(i => (
                            <IonSelectOption key={i.id} value={i.id}>{i.name} ({i.comuna})</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {template && (
                    <div className="ion-margin-top">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="ion-padding-horizontal">
                            <h3>{template.title}</h3>
                            <IonButton 
                                color="secondary" 
                                size="small" 
                                onClick={template.title.toLowerCase().includes('programa de riego') ? handleScanDocument : handleAddPhoto} 
                                disabled={isScanning}
                            >
                                <IonIcon slot="start" icon={scanOutline} />
                                {isScanning ? <IonSpinner name="dots" /> : 'Foto / OCR'}
                            </IonButton>
                        </div>
                        
                        {photos.length > 0 && (
                            <div className="ion-padding-horizontal">
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'gray' }}>Fotos adjuntadas: {photos.length}</p>
                                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {photos.map((p, idx) => (
                                        <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                                            <img 
                                                src={"data:image/jpeg;base64," + p} 
                                                alt={`foto-${idx}`} 
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} 
                                            />
                                            <IonIcon 
                                                icon={closeCircle} 
                                                color="danger" 
                                                style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '24px', cursor: 'pointer', background: 'white', borderRadius: '50%' }}
                                                onClick={() => handleDeletePhoto(idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {template.questions.map((q, index) => (
                            <IonItem key={q.id}>
                                <IonLabel position="stacked">{index + 1}. {q.text}</IonLabel>

                                {q.type === 'text' && (
                                    <IonInput
                                        placeholder="Tu respuesta..."
                                        value={answers[q.id] as string || ''}
                                        onIonInput={e => handleAnswerChange(q.id, e.detail.value!)}
                                    />
                                )}

                                {q.type === 'number' && (
                                    <IonInput
                                        type="number"
                                        placeholder="Número..."
                                        value={answers[q.id] as number || ''}
                                        onIonInput={e => handleAnswerChange(q.id, e.detail.value!)}
                                    />
                                )}

                                {q.type === 'multiple_choice' && (
                                    <IonSelect
                                        placeholder="Selecciona una opción"
                                        value={answers[q.id] as string || ''}
                                        onIonChange={e => handleAnswerChange(q.id, e.detail.value)}
                                    >
                                        {q.options?.map(opt => (
                                            <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>
                                        ))}
                                    </IonSelect>
                                )}
                            </IonItem>
                        ))}

                        <IonButton expand="block" className="ion-margin-top" onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? <IonSpinner name="crescent" /> : 'Guardar Respuesta'}
                        </IonButton>
                    </div>
                )}
            </IonCardContent>
        </IonCard>
    );
};

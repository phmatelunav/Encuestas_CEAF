import React, { useState } from 'react';
import {
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonInput, IonSelect, IonSelectOption,
    IonItemDivider, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonAlert,
    IonReorderGroup, IonReorder, ItemReorderEventDetail
} from '@ionic/react';
import { trashOutline, addOutline, createOutline, copyOutline } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import { useSurveyContext } from '../context/SurveyContext';
import { Question, QuestionType, SurveyTemplate } from '../types';

export const SurveyList: React.FC = () => {
    const { templates, deleteTemplate, addTemplate, updateTemplate } = useSurveyContext();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    const handleAddQuestion = () => {
        setQuestions([...questions, { id: nanoid(), type: 'text', text: '', options: [] }]);
    };

    const handleQuestionChange = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
        const itemMove = questions.splice(event.detail.from, 1)[0];
        questions.splice(event.detail.to, 0, itemMove);
        setQuestions([...questions]);
        event.detail.complete(true);
    };

    const handleEditTemplate = (template: SurveyTemplate) => {
        setEditingId(template.id);
        setNewTitle(template.title);
        // Create a deep copy of questions to avoid mutating the original directly in the modal
        setQuestions(JSON.parse(JSON.stringify(template.questions)));
        setShowModal(true);
    };

    const handleSaveTemplate = () => {
        if (!newTitle.trim() || questions.length === 0) return;
        
        if (editingId) {
            updateTemplate(editingId, {
                id: editingId,
                title: newTitle,
                questions
            });
        } else {
            const template: SurveyTemplate = {
                id: nanoid(),
                title: newTitle,
                questions
            };
            addTemplate(template);
        }
        
        closeModal();
    };

    const closeModal = () => {
        setShowModal(false);
        setNewTitle('');
        setQuestions([]);
        setEditingId(null);
    };

    const handleDuplicateTemplate = (template: SurveyTemplate) => {
        // Deep copy the original template to avoid any reference mutations
        const clonedQuestions: Question[] = JSON.parse(JSON.stringify(template.questions));
        
        // Regenerate unique IDs for all cloned questions to prevent React/State key collisions
        const newQuestions = clonedQuestions.map(q => ({
            ...q,
            id: nanoid()
        }));

        const duplicateTemplate: SurveyTemplate = {
            id: nanoid(),
            title: `${template.title} (Copia)`,
            questions: newQuestions
        };

        addTemplate(duplicateTemplate);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Plantillas de Encuestas</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonList>
                    {templates.length === 0 ? (
                        <p>No hay plantillas creadas.</p>
                    ) : (
                        templates.map(t => (
                            <IonItem key={t.id}>
                                <IonLabel>{t.title} ({t.questions.length} preg.)</IonLabel>
                                <IonButton fill="clear" color="primary" onClick={() => handleEditTemplate(t)}>
                                    <IonIcon slot="icon-only" icon={createOutline} />
                                </IonButton>
                                <IonButton fill="clear" color="secondary" onClick={() => handleDuplicateTemplate(t)}>
                                    <IonIcon slot="icon-only" icon={copyOutline} />
                                </IonButton>
                                <IonButton fill="clear" color="danger" onClick={() => setTemplateToDelete(t.id)}>
                                    <IonIcon slot="icon-only" icon={trashOutline} />
                                </IonButton>
                            </IonItem>
                        ))
                    )}
                </IonList>
                
                <IonAlert
                    isOpen={!!templateToDelete}
                    onDidDismiss={() => setTemplateToDelete(null)}
                    header="Confirmar Eliminación"
                    message="¿Estás seguro de que deseas eliminar esta plantilla definitivamente? Las respuestas asociadas también se omitirán."
                    buttons={[
                        {
                            text: 'Cancelar',
                            role: 'cancel'
                        },
                        {
                            text: 'Eliminar',
                            role: 'destructive',
                            handler: () => {
                                if (templateToDelete) {
                                    deleteTemplate(templateToDelete);
                                }
                            }
                        }
                    ]}
                />

                <IonButton expand="block" className="ion-margin-top" onClick={() => { setEditingId(null); setShowModal(true); }}>
                    <IonIcon slot="start" icon={addOutline} />
                    Nueva Plantilla
                </IonButton>

                <IonModal isOpen={showModal} onDidDismiss={closeModal}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{editingId ? 'Editar Plantilla' : 'Crear Plantilla'}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={closeModal}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonItem>
                            <IonLabel position="stacked">Título de la Encuesta</IonLabel>
                            <IonInput value={newTitle} onIonInput={e => setNewTitle(e.detail.value!)} placeholder="Ej: Encuesta de Suelos" />
                        </IonItem>

                        <IonItemDivider className="ion-margin-top">
                            <IonLabel>Preguntas</IonLabel>
                        </IonItemDivider>

                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {questions.map((q, index) => (
                                <IonCard key={q.id}>
                                    <IonItem color="light">
                                        <IonLabel><strong>Pregunta {index + 1}</strong></IonLabel>
                                        <IonReorder slot="end" />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="stacked">Texto de la pregunta</IonLabel>
                                        <IonInput value={q.text} onIonInput={e => handleQuestionChange(q.id, 'text', e.detail.value!)} placeholder="Texto de la pregunta" />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="stacked">Tipo de Respuesta</IonLabel>
                                        <IonSelect value={q.type} onIonChange={e => handleQuestionChange(q.id, 'type', e.detail.value)}>
                                            <IonSelectOption value="text">Texto Libre</IonSelectOption>
                                            <IonSelectOption value="number">Número</IonSelectOption>
                                            <IonSelectOption value="multiple_choice">Opción Múltiple</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                    {q.type === 'multiple_choice' && (
                                        <IonItem>
                                            <IonLabel position="stacked">Opciones (separadas por coma)</IonLabel>
                                            <IonInput
                                                value={q.optionsRaw ?? q.options?.join(', ')}
                                                onIonInput={e => {
                                                    const val = e.detail.value || '';
                                                    setQuestions(questions.map(ques => ques.id === q.id ? {
                                                        ...ques,
                                                        optionsRaw: val,
                                                        options: val.split(',').map(s => s.trim()).filter(s => s)
                                                    } : ques));
                                                }}
                                                placeholder="Opción 1, Opción 2..."
                                            />
                                        </IonItem>
                                    )}
                                    <IonButton fill="clear" color="danger" onClick={() => setQuestions(questions.filter(ques => ques.id !== q.id))}>
                                        Eliminar Pregunta
                                    </IonButton>
                                </IonCard>
                            ))}
                        </IonReorderGroup>

                        <IonButton expand="block" fill="outline" className="ion-margin-top" onClick={handleAddQuestion}>
                            Agregar Pregunta
                        </IonButton>

                        <IonButton expand="block" className="ion-margin-top" onClick={handleSaveTemplate} disabled={!newTitle || questions.length === 0}>
                            Guardar Plantilla
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonCardContent>
        </IonCard>
    );
};

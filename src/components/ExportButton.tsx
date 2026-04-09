import React, { useState } from 'react';
import { IonButton, IonIcon, IonToast } from '@ionic/react';
import { shareOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { useSurveyContext } from '../context/SurveyContext';
import { SurveyResponse } from '../types';

export const ExportButton: React.FC = () => {
    const { templates, responses, interviewees } = useSurveyContext();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleExport = async () => {
        if (responses.length === 0) {
            setToastMessage('No hay respuestas para exportar.');
            setShowToast(true);
            return;
        }

        try {
            const dataToExport = responses.map((r: SurveyResponse) => {
                const template = templates.find(t => t.id === r.templateId);
                const interviewee = interviewees.find(i => i.id === r.intervieweeId);

                // Base info merged with Interviewee
                const row: Record<string, any> = {
                    'ID Respuesta': r.id,
                    'Encuesta': template?.title || 'Desconocida',
                    'Fecha': new Date(r.timestamp).toLocaleString(),
                    'Usuario Registrado': interviewee?.name || 'Vacio',
                    'RUT': interviewee?.rut || '',
                    'Comuna': interviewee?.comuna || '',
                    'Sector': interviewee?.sector || '',
                    'Teléfono': interviewee?.telefono || '',
                    'Rubro': interviewee?.rubro || '',
                    'Asesor': interviewee?.asesor || '',
                    'Latitud': r.location?.latitude ?? '',
                    'Longitud': r.location?.longitude ?? '',
                    'Fotos Adjuntas (Cantidad)': r.photos?.length || 0
                };

                // If template is found, map questions to human-readable columns
                if (template) {
                    template.questions.forEach(q => {
                        row[q.text] = r.answers[q.id] ?? '';
                    });
                }

                return row;
            });

            // 2. Generate Excel Workbook
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Respuestas');

            const base64DataXLSX = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

            // 3. Create ZIP Archive
            const zip = new JSZip();
            
            // Add excel to zip
            zip.file("Resultados_Encuestas.xlsx", base64DataXLSX, { base64: true });

            // Add photos to zip folder
            const fotosFolder = zip.folder("Fotos");
            if (fotosFolder) {
                responses.forEach((r: SurveyResponse) => {
                    if (r.photos && r.photos.length > 0) {
                        const interviewee = interviewees.find(i => i.id === r.intervieweeId);
                        // Limpiar nombre: solo a-z, quitar tildes, sin espacios dobles, reemplazar espacios por guiones bajos
                        const userStr = interviewee?.name
                            ? interviewee.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '_')
                            : 'usuario_desc';
                        
                        const dateObj = new Date(r.timestamp);
                        const dateStr = `${dateObj.getDate()}_${dateObj.getMonth() + 1}_${dateObj.getFullYear()}`;

                        r.photos.forEach((photoBase64: string, index: number) => {
                            // Filename format: juan_perez_14_3_2026_1.jpg
                            const photoName = `${userStr}_${dateStr}_${index + 1}.jpg`;
                            fotosFolder.file(photoName, photoBase64, { base64: true });
                        });
                    }
                });
            }

            // Generate ZIP as base64
            const zipContentBase64 = await zip.generateAsync({ type: "base64" });

            // 4. Write to device Filesystem
            const fileName = `Exportacion_CEAF_${new Date().getTime()}.zip`;

            const fileResult = await Filesystem.writeFile({
                path: fileName,
                data: zipContentBase64,
                directory: Directory.Cache // Used Cache because it plays nicely with @capacitor/share
            });

            // 5. Share using native capabilities
            if (Capacitor.isNativePlatform()) {
                await Share.share({
                    title: 'Resultados Encuestas CEAF (ZIP)',
                    text: 'Adjunto envío los resultados de las encuestas y sus fotografías comprimidas en un ZIP.',
                    url: fileResult.uri,
                    dialogTitle: 'Compartir Resultados con...'
                });
            } else {
                // Fallback for Web/Browser
                setToastMessage(`Exportado exitosamente (WebFallback). Archivo: ${fileName}`);
                setShowToast(true);

                // Simple HTML5 download for web testing
                const blob = new Blob([s2ab(atob(zipContentBase64))], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting data', error);
            setToastMessage('Ocurrió un error al exportar.');
            setShowToast(true);
        }
    };

    // Helper for web fallback download
    const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    return (
        <>
            <IonButton expand="block" color="success" onClick={handleExport}>
                <IonIcon slot="start" icon={shareOutline} />
                Exportar Todo a ZIP
            </IonButton>

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
            />
        </>
    );
};

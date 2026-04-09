import React, { useState } from 'react';
import {
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonInput, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonAlert
} from '@ionic/react';
import { trashOutline, addOutline, createOutline } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import { useSurveyContext } from '../context/SurveyContext';
import { Interviewee } from '../types';

export const IntervieweeList: React.FC = () => {
    const { interviewees, deleteInterviewee, addInterviewee, updateInterviewee } = useSurveyContext();
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Interviewee>>({});
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const handleEdit = (item: Interviewee) => {
        setEditingId(item.id);
        setFormData({ ...item });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name?.trim()) return;

        const newInterviewee = {
            id: editingId || nanoid(),
            name: formData.name || '',
            rut: formData.rut || '',
            comuna: formData.comuna || '',
            telefono: formData.telefono || '',
            sector: formData.sector || '',
            rubro: formData.rubro || '',
            asesor: formData.asesor || ''
        };
        
        if (editingId) {
            updateInterviewee(editingId, newInterviewee);
        } else {
            addInterviewee(newInterviewee);
        }
        
        closeModal();
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({});
        setEditingId(null);
    };

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Registro de Usuarios</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonButton expand="block" className="ion-margin-bottom" onClick={() => { setEditingId(null); setShowModal(true); }}>
                    <IonIcon slot="start" icon={addOutline} />
                    Nuevo Usuario
                </IonButton>

                <IonList>
                    {interviewees.length === 0 ? (
                        <p>No hay usuarios registrados.</p>
                    ) : (
                        [...interviewees]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(t => (
                            <IonItem key={t.id}>
                                <IonLabel>
                                    <h2>{t.name}</h2>
                                    <p>{t.rut} - {t.comuna}</p>
                                    <p>Sector: {t.sector} / Rubro: {t.rubro}</p>
                                </IonLabel>
                                <IonButton fill="clear" color="primary" onClick={() => handleEdit(t)}>
                                    <IonIcon slot="icon-only" icon={createOutline} />
                                </IonButton>
                                <IonButton fill="clear" color="danger" onClick={() => setItemToDelete(t.id)}>
                                    <IonIcon slot="icon-only" icon={trashOutline} />
                                </IonButton>
                            </IonItem>
                        ))
                    )}
                </IonList>
                
                <IonAlert
                    isOpen={!!itemToDelete}
                    onDidDismiss={() => setItemToDelete(null)}
                    header="Confirmar Eliminación"
                    message="¿Estás seguro de que deseas eliminar este usuario?"
                    buttons={[
                        { text: 'Cancelar', role: 'cancel' },
                        {
                            text: 'Eliminar',
                            role: 'destructive',
                            handler: () => {
                                if (itemToDelete) deleteInterviewee(itemToDelete);
                            }
                        }
                    ]}
                />

                <IonModal isOpen={showModal} onDidDismiss={closeModal}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{editingId ? 'Editar Usuario' : 'Crear Usuario'}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={closeModal}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonItem>
                            <IonLabel position="stacked">Nombre Completo (*)</IonLabel>
                            <IonInput value={formData.name} onIonInput={e => setFormData({...formData, name: e.detail.value!})} placeholder="Ej: Juan Pérez" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">RUT</IonLabel>
                            <IonInput value={formData.rut} onIonInput={e => setFormData({...formData, rut: e.detail.value!})} placeholder="Ej: 12.345.678-9" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Comuna</IonLabel>
                            <IonInput value={formData.comuna} onIonInput={e => setFormData({...formData, comuna: e.detail.value!})} placeholder="Ej: Rengo" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Teléfono</IonLabel>
                            <IonInput value={formData.telefono} onIonInput={e => setFormData({...formData, telefono: e.detail.value!})} placeholder="Ej: +569 12345678" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Sector</IonLabel>
                            <IonInput value={formData.sector} onIonInput={e => setFormData({...formData, sector: e.detail.value!})} placeholder="Sector geográfico" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Rubro</IonLabel>
                            <IonInput value={formData.rubro} onIonInput={e => setFormData({...formData, rubro: e.detail.value!})} placeholder="Citricos, Hortalizas..." />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Asesor</IonLabel>
                            <IonInput value={formData.asesor} onIonInput={e => setFormData({...formData, asesor: e.detail.value!})} placeholder="Nombre del Asesor" />
                        </IonItem>

                        <IonButton expand="block" className="ion-margin-top" onClick={handleSave} disabled={!formData.name}>
                            Guardar Usuario
                        </IonButton>
                    </IonContent>
                </IonModal>
            </IonCardContent>
        </IonCard>
    );
};

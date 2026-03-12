import React, { useState, useRef } from 'react';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonText, IonFooter, IonIcon
} from '@ionic/react';
import { documentTextOutline, listOutline, shareSocialOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

interface TutorialModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onDismiss }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const swiperRef = useRef<any>(null); // To control slides later if needed or via events
  const totalSlides = 3;

  const handleSkip = async () => {
    await Preferences.set({ key: 'hasSeenTutorial', value: 'true' });
    onDismiss();
  };

  const handleNext = () => {
    // In ionic/react 6+ we use Swiper directly for sliders, but for a simple modal, 
    // we can manage a basic manual state view instead of complex swipers.
    if (slideIndex < totalSlides - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      handleSkip(); // Finish
    }
  };

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Bienvenido a CEAF</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding ion-text-center" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '2rem' }}>
          
          {slideIndex === 0 && (
            <div>
              <IonIcon icon={listOutline} style={{ fontSize: '6rem', color: '#3880ff' }} />
              <h2>1. Crea Plantillas</h2>
              <p className="ion-margin-top text-muted">
                Comienza diseñando la estructura de tu encuesta. Puedes agregar preguntas de opción múltiple, texto libre o números, e incluso cambiar su orden manteniendo presionado el ícono de arrastre.
              </p>
            </div>
          )}

          {slideIndex === 1 && (
            <div>
              <IonIcon icon={documentTextOutline} style={{ fontSize: '6rem', color: '#2dd36f' }} />
              <h2>2. Toma de Datos</h2>
              <p className="ion-margin-top text-muted">
                Dirígete al formulario para recolectar información en terreno. Funciona 100% sin internet. Además, puedes escanear hojas físicas o vincular fotografías a cada respuesta.
              </p>
            </div>
          )}

          {slideIndex === 2 && (
            <div>
              <IonIcon icon={shareSocialOutline} style={{ fontSize: '6rem', color: '#ffc409' }} />
              <h2>3. Exportar y Compartir</h2>
              <p className="ion-margin-top text-muted">
                Cuando estés listo, convierte todas las métricas en un Excel comprimido con todas sus fotografías mediante un solo toque. Podrás compartir este archivo final directamente a tu equipo por WhatsApp, Correo o Drive.
              </p>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
             {/* Simple Bullet indicators */}
             <span style={{ fontSize: '2rem', color: slideIndex === 0 ? '#3880ff' : '#ccc' }}>•</span>
             <span style={{ fontSize: '2rem', color: slideIndex === 1 ? '#3880ff' : '#ccc', margin: '0 10px' }}>•</span>
             <span style={{ fontSize: '2rem', color: slideIndex === 2 ? '#3880ff' : '#ccc' }}>•</span>
          </div>
        </div>

      </IonContent>

      <IonFooter className="ion-no-border">
        <IonToolbar>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <IonButton fill="clear" color="medium" onClick={handleSkip}>
                  Saltar tutorial
                </IonButton>
                <IonButton onClick={handleNext}>
                  {slideIndex === totalSlides - 1 ? '¡Empezar!' : 'Ver siguiente'}
                </IonButton>
             </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

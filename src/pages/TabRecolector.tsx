import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { powerOutline } from 'ionicons/icons';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SurveyForm } from '../components/SurveyForm';

const TabRecolector: React.FC = () => {

  const handleExit = () => {
    if (Capacitor.isNativePlatform()) {
      App.exitApp();
    } else {
      alert('La función "Salir" solo está disponible en la app instalada.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tomar Encuesta</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleExit}>
              <IonIcon slot="icon-only" icon={powerOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tomar Encuesta</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <SurveyForm />
        
      </IonContent>
    </IonPage>
  );
};

export default TabRecolector;

import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { powerOutline } from 'ionicons/icons';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SurveyList } from '../components/SurveyList';

const TabGestor: React.FC = () => {

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
          <IonTitle>Crear Plantillas</IonTitle>
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
            <IonTitle size="large">Crear Plantillas</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <SurveyList />
        
      </IonContent>
    </IonPage>
  );
};

export default TabGestor;

import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { SurveyForm } from '../components/SurveyForm';

const TabRecolector: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tomar Encuesta</IonTitle>
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

import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { SurveyList } from '../components/SurveyList';

const TabGestor: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Crear Plantillas</IonTitle>
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

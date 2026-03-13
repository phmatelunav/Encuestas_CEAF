import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter } from '@ionic/react';
import { SurveyResults } from '../components/SurveyResults';
import { ExportButton } from '../components/ExportButton';

const TabResultados: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Resultados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Resultados</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <SurveyResults />

        <div className="ion-margin-top ion-padding-bottom">
          <ExportButton />
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <p className="ion-text-center ion-padding-horizontal" style={{ fontSize: '0.8rem', color: 'gray', margin: '10px 0' }}>
            Herramienta desarrollada por Patricio Mateluna V. Centro de Estudios Avanzados en Fruticultura. 2026
          </p>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default TabResultados;

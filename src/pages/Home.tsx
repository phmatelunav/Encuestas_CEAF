import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonFooter } from '@ionic/react';
import { powerOutline } from 'ionicons/icons';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SurveyList } from '../components/SurveyList';
import { SurveyForm } from '../components/SurveyForm';
import { SurveyResults } from '../components/SurveyResults';
import { ExportButton } from '../components/ExportButton';
import { TutorialModal } from '../components/TutorialModal';
import { Preferences } from '@capacitor/preferences';
import { useEffect, useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const checkTutorial = async () => {
      const { value } = await Preferences.get({ key: 'hasSeenTutorial' });
      if (value !== 'true') {
        setShowTutorial(true);
      }
    };
    checkTutorial();
  }, []);
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
          <IonTitle>Encuestas CEAF</IonTitle>
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
            <IonTitle size="large">Encuestas CEAF</IonTitle>
          </IonToolbar>
        </IonHeader>

        <SurveyList />

        <div className="ion-margin-top">
          <SurveyForm />
        </div>

        <div className="ion-margin-top">
          <SurveyResults />
        </div>

        <div className="ion-margin-top">
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

      <TutorialModal 
        isOpen={showTutorial} 
        onDismiss={() => setShowTutorial(false)} 
      />
    </IonPage>
  );
};

export default Home;

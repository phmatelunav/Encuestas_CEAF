import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { documentTextOutline, addCircleOutline, barChartOutline } from 'ionicons/icons';
import TabGestor from './pages/TabGestor';
import TabRecolector from './pages/TabRecolector';
import TabResultados from './pages/TabResultados';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

import { SurveyProvider } from './context/SurveyContext';
import { TutorialModal } from './components/TutorialModal';
import { Preferences } from '@capacitor/preferences';
import { useEffect, useState } from 'react';

const App: React.FC = () => {
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

  return (
    <IonApp>
      <SurveyProvider>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab-gestor">
                <TabGestor />
              </Route>
              <Route exact path="/tab-recolector">
                <TabRecolector />
              </Route>
              <Route exact path="/tab-resultados">
                <TabResultados />
              </Route>
              <Route exact path="/">
                <Redirect to="/tab-gestor" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="tab-gestor" href="/tab-gestor">
                <IonIcon icon={addCircleOutline} />
                <IonLabel>Plantillas</IonLabel>
              </IonTabButton>

              <IonTabButton tab="tab-recolector" href="/tab-recolector">
                <IonIcon icon={documentTextOutline} />
                <IonLabel>Toma Datos</IonLabel>
              </IonTabButton>

              <IonTabButton tab="tab-resultados" href="/tab-resultados">
                <IonIcon icon={barChartOutline} />
                <IonLabel>Resultados</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>

        <TutorialModal 
          isOpen={showTutorial} 
          onDismiss={() => setShowTutorial(false)} 
        />
      </SurveyProvider>
    </IonApp>
  );
};

export default App;

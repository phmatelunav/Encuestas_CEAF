import React, { useState } from 'react';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonSelect, IonSelectOption, IonText, IonAccordion, IonAccordionGroup,
  IonList, IonBadge
} from '@ionic/react';
import { useSurveyContext } from '../context/SurveyContext';

export const SurveyResults: React.FC = () => {
  const { templates, responses } = useSurveyContext();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const template = templates.find(t => t.id === selectedTemplateId);
  const templateResponses = responses.filter(r => r.templateId === selectedTemplateId);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Resultados Obtenidos</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {templates.length === 0 ? (
          <IonText color="medium">No hay encuestas creadas.</IonText>
        ) : (
          <IonItem>
            <IonLabel position="stacked">Visualizar respuestas de</IonLabel>
            <IonSelect
              value={selectedTemplateId}
              onIonChange={e => setSelectedTemplateId(e.detail.value)}
              placeholder="Seleccionar encuesta"
            >
              {templates.map(t => (
                <IonSelectOption key={t.id} value={t.id}>
                  {t.title}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}

        {template && (
          <div className="ion-margin-top">
            <h4 className="ion-padding-start">
              Total respuestas: <IonBadge color="primary">{templateResponses.length}</IonBadge>
            </h4>

            {templateResponses.length === 0 ? (
              <p className="ion-padding-start">No se han registrado datos para esta encuesta aún.</p>
            ) : (
              <IonAccordionGroup>
                {templateResponses.map((res, index) => (
                  <IonAccordion value={res.id} key={res.id}>
                    <IonItem slot="header" color="light">
                      <IonLabel>
                        Respuesta #{index + 1} - {new Date(res.timestamp).toLocaleString()}
                        {res.location && (
                          <p style={{ marginTop: '5px', fontSize: '0.85em', color: 'gray' }}>
                            Ubicación: {res.location.latitude.toFixed(5)}, {res.location.longitude.toFixed(5)}
                          </p>
                        )}
                      </IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                      <IonList lines="none">
                        {template.questions.map(q => (
                          <IonItem key={q.id}>
                            <IonLabel className="ion-text-wrap">
                              <strong>{q.text}</strong>
                              <p>{res.answers[q.id] || <em>Sin responder</em>}</p>
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </div>
                  </IonAccordion>
                ))}
              </IonAccordionGroup>
            )}
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

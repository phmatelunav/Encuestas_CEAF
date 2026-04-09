import React, { createContext, useContext, useState, useEffect } from 'react';
import { SurveyTemplate, SurveyResponse, Interviewee } from '../types';
import { defaultInterviewees, defaultTemplate } from '../data/preloadedData';

interface SurveyContextType {
    templates: SurveyTemplate[];
    responses: SurveyResponse[];
    interviewees: Interviewee[];
    addTemplate: (template: SurveyTemplate) => void;
    updateTemplate: (id: string, updatedTemplate: SurveyTemplate) => void;
    deleteTemplate: (id: string) => void;
    addResponse: (response: SurveyResponse) => void;
    updateResponse: (id: string, updatedResponse: SurveyResponse) => void;
    addInterviewee: (i: Interviewee) => void;
    updateInterviewee: (id: string, i: Interviewee) => void;
    deleteInterviewee: (id: string) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [templates, setTemplates] = useState<SurveyTemplate[]>(() => {
        const saved = localStorage.getItem('templates');
        return saved ? JSON.parse(saved) : [defaultTemplate];
    });

    const [responses, setResponses] = useState<SurveyResponse[]>(() => {
        const saved = localStorage.getItem('responses');
        return saved ? JSON.parse(saved) : [];
    });

    const [interviewees, setInterviewees] = useState<Interviewee[]>(() => {
        const saved = localStorage.getItem('interviewees');
        return saved ? JSON.parse(saved) : defaultInterviewees;
    });

    useEffect(() => {
        localStorage.setItem('templates', JSON.stringify(templates));
    }, [templates]);

    useEffect(() => {
        localStorage.setItem('responses', JSON.stringify(responses));
    }, [responses]);

    useEffect(() => {
        localStorage.setItem('interviewees', JSON.stringify(interviewees));
    }, [interviewees]);

    const addTemplate = (template: SurveyTemplate) => {
        setTemplates(prev => [...prev, template]);
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        // Opcional: eliminar respuestas asociadas
        // setResponses(prev => prev.filter(r => r.templateId !== id));
    };

    const updateTemplate = (id: string, updatedTemplate: SurveyTemplate) => {
        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
    };

    const addResponse = (response: SurveyResponse) => {
        setResponses(prev => [...prev, response]);
    };

    const updateResponse = (id: string, updatedResponse: SurveyResponse) => {
        setResponses(prev => prev.map(r => r.id === id ? updatedResponse : r));
    };

    const addInterviewee = (i: Interviewee) => {
        setInterviewees(prev => [...prev, i]);
    };

    const updateInterviewee = (id: string, updated: Interviewee) => {
        setInterviewees(prev => prev.map(i => i.id === id ? updated : i));
    };

    const deleteInterviewee = (id: string) => {
        setInterviewees(prev => prev.filter(i => i.id !== id));
    };

    return (
        <SurveyContext.Provider value={{
            templates, responses, interviewees,
            addTemplate, updateTemplate, deleteTemplate, addResponse, updateResponse,
            addInterviewee, updateInterviewee, deleteInterviewee
        }}>
            {children}
        </SurveyContext.Provider>
    );
};

export const useSurveyContext = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurveyContext must be used within a SurveyProvider');
    }
    return context;
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { AppConfig } from './App.tsx';
import { z } from 'zod';
import './index.css';

declare global {
    interface Window {
        eldramaticConfig: AppConfig;
    }
}

if (window.eldramaticConfig == null) {
    throw new Error('[EldramaticWebchat]: config not found');
}

// validate with zod
const configSchema = z.object({
    apiConfig: z.object({
        baseUrl: z.string().url(),
        apiKey: z.string(),
        automationId: z.string(),
    }),
    embedConfig: z.object({
        name: z.string(),
        description: z.string(),
        logo: z.string().url(),
        primaryColor: z.string(),
        foregroundColor: z.string(),
        chatPopupWidth: z.number(),
        chatPopupHeight: z.number(),
        chatTriggerSize: z.number(),
        welcomeMessage: z.string().optional(),
        welcomeMessageDelay: z.number().optional(),
    }),
});

try {
    configSchema.parse(window.eldramaticConfig);
} catch (error) {
    console.error(`[EldramaticWebchat]: Invalid config`, error);
    throw error;
}

const config: AppConfig = window.eldramaticConfig;

const eldramaticElm = document.createElement('div');
eldramaticElm.id = 'eldramatic-root';
document.body.appendChild(eldramaticElm);

ReactDOM.createRoot(eldramaticElm).render(
    <React.StrictMode>
        <App config={config} />
    </React.StrictMode>
);

import { createContext, useContext } from 'react';
import { AutomationPlatform, IWebchatEmbedConfig } from '../../../types';

export type ChatContextType = {
    platform: AutomationPlatform;
    webchatEmbedConfig: IWebchatEmbedConfig;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
    return useContext(ChatContext) as ChatContextType;
};

export const ChatContextProvider = ({
    children,
    webchatEmbedConfig,
}: {
    children: React.ReactNode;
    platform: AutomationPlatform;
    webchatEmbedConfig: IWebchatEmbedConfig;
}) => {
    return (
        <ChatContext.Provider
            value={{ platform: 'webchat', webchatEmbedConfig }}
        >
            {children}
        </ChatContext.Provider>
    );
};

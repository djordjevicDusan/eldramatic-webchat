import { useEffect, useState } from 'react';
import { WebchatEmbed } from './components/webchat-embed';
import { IMessage, IWebchatEmbedConfig } from './types';
import {
    ChatHandlerAPIService,
    IAPIConfig,
} from './services/chat-handler-api.service';

export interface AppConfig {
    apiConfig: IAPIConfig;
    embedConfig: IWebchatEmbedConfig;
}

export interface AppProps {
    config: AppConfig;
}

function App({ config }: AppProps) {
    const [fetchingSession, setFetchingSession] = useState<boolean>(false);
    const [sessionError, setSessionError] = useState<string | undefined>(
        undefined
    );
    const [chatSessionId, setChatSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [incomingMessage, setIncomingMessage] = useState<IMessage[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const chatHandlerService = new ChatHandlerAPIService(config.apiConfig);

    const fetchSession = async () => {
        if (fetchingSession) return;
        if (chatSessionId != null) return;

        setFetchingSession(true);
        setSessionError(undefined);

        try {
            const sessionIdFromStorage =
                localStorage.getItem('eldramatic-session');

            if (sessionIdFromStorage != null) {
                const data = await chatHandlerService.restoreChatSession(
                    sessionIdFromStorage
                );
                if (data != null) {
                    setChatSessionId(data.sessionId);
                    setMessages((prev) => [...prev, ...data.messages]);
                    return;
                }
            }

            const data = await chatHandlerService.initChatSession();
            setChatSessionId(data.sessionId);
            setIncomingMessage((prev) => [...prev, ...data.messages]);
            localStorage.setItem('eldramatic-session', data.sessionId);
        } catch (error) {
            console.error(`[EldramaticWebchat]: Error fetching session`, error);
            setSessionError(
                'Failed to connect to the server. Please try again later.'
            );
        }
        setFetchingSession(false);
    };

    useEffect(() => {
        return () => {
            setChatSessionId(null);
            setMessages([]);
            setIncomingMessage([]);
        };
    }, []);

    useEffect(() => {
        if (incomingMessage.length == 0) {
            setIsTyping(false);
            return;
        }
        setIsTyping(true);

        const nextMessageIsSuggestions =
            incomingMessage[0]?.action.type === 'suggestions';

        // append each incoming message to the messages array on 500ms interval
        const appendMessage = setTimeout(
            () => {
                if (incomingMessage.length == 0) {
                    setIsTyping(false);
                    return;
                }

                const message = incomingMessage[0];
                setMessages((prev) => [...prev, message]);
                setIncomingMessage((prev) => prev.slice(1));
            },
            nextMessageIsSuggestions ? 0 : 1000
        );
        return () => clearTimeout(appendMessage);
    }, [incomingMessage]);

    const onSendMessage = async (message: string) => {
        setMessages((prev) => [
            ...prev,
            {
                nodeId: '-1',
                sender: 'user',
                action: {
                    type: 'message',
                    id: '-1',
                    messages: [message],
                },
                type: 'text',
            },
        ]);
        let alreadyReceived = false;
        setTimeout(() => {
            if (alreadyReceived) return;
            setIsTyping(true);
        }, 200);

        if (chatSessionId) {
            const data = await chatHandlerService.sendMessage(
                chatSessionId,
                message
            );
            alreadyReceived = true;
            if (!data) return;
            setIncomingMessage((prev) => [...prev, ...data.messages]);
        }
    };

    return (
        <div className='fixed bottom-0 right-0 z-50 p-5'>
            <WebchatEmbed
                config={config.embedConfig}
                messages={messages}
                onSendMessage={onSendMessage}
                isTyping={isTyping}
                sessionError={sessionError}
                onChatboxOpen={async () => {
                    await fetchSession();
                }}
                isSessionInitiated={chatSessionId !== null}
            />
        </div>
    );
}

export default App;

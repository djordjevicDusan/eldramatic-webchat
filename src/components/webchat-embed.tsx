import { useEffect, useState } from 'react';
import { IMessage, IWebchatEmbedConfig } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { twoLetters } from '../lib/utils';
import { ChatPreview } from './chat-preview-new/chat-preview';

interface WebchatEmbedProps {
    messages: IMessage[];
    config: IWebchatEmbedConfig;
    isTyping?: boolean;
    onSendMessage?: (message: string) => void;
    onChatboxOpen: () => Promise<void>;
    isSessionInitiated: boolean;
    sessionError?: string;
}

export const WebchatEmbed = ({
    messages,
    config,
    onSendMessage,
    isTyping,
    onChatboxOpen,
    isSessionInitiated,
    sessionError,
}: WebchatEmbedProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (config.welcomeMessage) {
            setTimeout(() => {
                setWelcomeMessage(config.welcomeMessage);
            }, config.welcomeMessageDelay);
        }
    }, []);

    const welcomeMessageStyles = {
        backgroundColor: config.primaryColor,
        color: config.foregroundColor,
    };

    const welcomeMessageIsVisible = welcomeMessage && !isOpen;

    if (config.welcomeMessage) {
        messages = [
            {
                sender: 'automation',
                nodeId: '-1',
                action: {
                    type: 'message',
                    id: '1',
                    messages: [config.welcomeMessage],
                },
            },
            ...messages,
        ];
    }

    return (
        <div className='flex flex-col gap-2 items-end'>
            {isOpen && (
                <ChatPreview
                    webchatEmbedConfig={config}
                    isTyping={isTyping || false}
                    sessionError={sessionError}
                    messages={messages}
                    onSendMessage={
                        isSessionInitiated ? onSendMessage : undefined
                    }
                    onMinimizeClick={() => {
                        setIsOpen(!isOpen);
                    }}
                />
            )}
            <div className='flex items-center gap-2'>
                {welcomeMessageIsVisible && (
                    <div
                        className='text-sm p-2 font-semibold rounded-2xl whitespace-pre-line break-all'
                        style={welcomeMessageStyles}
                    >
                        {welcomeMessage}
                    </div>
                )}
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) onChatboxOpen();
                    }}
                >
                    <Avatar
                        style={{
                            width: `${config.chatTriggerSize}px`,
                            height: `${config.chatTriggerSize}px`,
                        }}
                        className='text-primary'
                    >
                        <AvatarImage src={config.logo} />
                        <AvatarFallback>
                            {twoLetters(config.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </div>
        </div>
    );
};

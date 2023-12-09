import { useEffect, useRef } from 'react';
import { IMessage, IWebchatEmbedConfig, SuggestionsAction } from '../../types';
import { cn } from '../../lib/utils';
import { ChatContextProvider } from './context/chat.context';
import { ChatHeader } from './chat-header';
import { ChatMessage } from './chat-message';
import { ChatSuggestions } from './chat-suggestions';
import { ChatFooter } from './chat-footer';

export interface ChatPreviewProps {
    webchatEmbedConfig: IWebchatEmbedConfig;
    messages: IMessage[];
    isTyping: boolean;
    onSendMessage?: (message: string) => void;
    onMinimizeClick?: () => void;
    className?: string;
    sessionError?: string;
}

export const ChatPreview = ({
    webchatEmbedConfig,
    messages,
    isTyping,
    onSendMessage,
    onMinimizeClick,
    className,
    sessionError,
}: ChatPreviewProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const messagesWithoutSuggestions: IMessage[] = [];
    const suggestions: { actions: SuggestionsAction[]; nodeId: string } = {
        actions: [],
        nodeId: '',
    };

    messages.forEach((message, index) => {
        if (message.action.type === 'suggestions') {
            if (index === messages.length - 1) {
                suggestions.actions.push(message.action);
                suggestions.nodeId = message.nodeId;
            }
        } else {
            messagesWithoutSuggestions.push(message);
        }
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [messages.length, isTyping]);

    const widthStyle =
        webchatEmbedConfig.chatPopupWidth === -1000
            ? {}
            : {
                  width: `${webchatEmbedConfig.chatPopupWidth}px`,
              };

    return (
        <ChatContextProvider
            platform={'webchat'}
            webchatEmbedConfig={webchatEmbedConfig}
        >
            <div
                style={widthStyle}
                className='rounded-xl flex flex-col border bg-card text-card-foreground shadow h-fit'
            >
                <ChatHeader onMinimizeClick={onMinimizeClick} />
                <div
                    ref={ref}
                    style={{
                        height: `${webchatEmbedConfig.chatPopupHeight - 100}px`,
                    }}
                    className={cn(
                        'p-4 flex flex-col gap-3 overflow-y-auto',
                        className
                    )}
                >
                    {sessionError && (
                        <div className='text-red-500 text-center'>
                            {sessionError}
                        </div>
                    )}

                    {sessionError == null &&
                        messagesWithoutSuggestions.map((message, index) => {
                            const previousSender =
                                messagesWithoutSuggestions[index - 1]?.sender;
                            const hideAvatar =
                                previousSender === message.sender;

                            return (
                                <ChatMessage
                                    key={index}
                                    message={message}
                                    position={
                                        message.sender === 'user'
                                            ? 'right'
                                            : 'left'
                                    }
                                    hideAvatar={hideAvatar}
                                />
                            );
                        })}
                    {sessionError == null && isTyping && (
                        <ChatMessage
                            message={{
                                action: {
                                    type: 'message',
                                    id: '-1',
                                    messages: ['...'],
                                },
                                nodeId: '-1',
                                sender: 'automation',
                            }}
                            position='left'
                        />
                    )}
                </div>
                {sessionError == null && suggestions.actions.length > 0 && (
                    <ChatSuggestions
                        nodeId={suggestions.nodeId}
                        suggestionActions={suggestions.actions}
                        onSendMessage={onSendMessage}
                    />
                )}
                <ChatFooter onSendMessage={onSendMessage} />
                <div className='p-1 text-xs text-right text-muted-foreground bg-secondary'>
                    powered by Eldramatic
                </div>
            </div>
        </ChatContextProvider>
    );
};

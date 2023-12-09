import { useChatContext } from './context/chat.context';
import { SuggestionsAction } from '../../types';
import { cn } from '../../lib/utils';

interface ChatSuggestionsProps {
    suggestionActions: SuggestionsAction[];
    nodeId: string;
    onSendMessage?: (message: string) => void;
}

export const ChatSuggestions = ({
    suggestionActions,
    onSendMessage,
}: ChatSuggestionsProps) => {
    const { webchatEmbedConfig } = useChatContext();

    const messageStyles = {
        borderColor: webchatEmbedConfig.primaryColor,
        color: webchatEmbedConfig.primaryColor,
    };

    return suggestionActions.map((action, index) => {
        return (
            <div className='flex flex-col items-center' key={index}>
                <div
                    className={cn(
                        'flex p-2 border w-full flex-wrap gap-2 justify-items-start'
                    )}
                >
                    {action.suggestions.map((suggestion, suggestionIndex) => {
                        return (
                            <div
                                onClick={() => {
                                    if (!onSendMessage) return;
                                    onSendMessage(suggestion);
                                }}
                                className='p-1 px-2 text-sm border text-primary font-semibold rounded-2xl whitespace-pre-line break-all cursor-pointer'
                                key={suggestionIndex}
                                style={messageStyles}
                            >
                                {suggestion}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    });
};

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useChatContext } from './context/chat.context';

interface ChatFooterProps {
    onSendMessage?: (message: string) => void;
}

export const ChatFooter = ({ onSendMessage }: ChatFooterProps) => {
    const {
        webchatEmbedConfig: { foregroundColor, primaryColor },
    } = useChatContext();

    const [message, setMessage] = useState<string>('');

    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSendMessageClicked();
        }
    };

    const onSendMessageClicked = () => {
        if (message.trim().length === 0) return;
        if (!onSendMessage) return;

        onSendMessage(message);
        setMessage('');
    };

    const sendMessageOnClickHandler = onSendMessage
        ? onSendMessageClicked
        : undefined;

    return (
        <div className='p-2 flex flex-col'>
            <div className='rounded-xl bg-primary-foreground flex justify-between items-center w-full gap-2'>
                <div className='flex flex-1 gap-4 items-center'>
                    {onSendMessage ? (
                        <Input
                            value={message}
                            onChange={onInputChanged}
                            onKeyDown={onInputKeyDown}
                            placeholder='Type a message...'
                        />
                    ) : (
                        <p className='p-2 text-muted-foreground'>
                            Type a message...
                        </p>
                    )}
                </div>
                <div>
                    <Button
                        className='p-1'
                        style={{
                            backgroundColor: primaryColor,
                            color: foregroundColor,
                        }}
                        onClick={sendMessageOnClickHandler}
                        size={'icon'}
                    >
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
};

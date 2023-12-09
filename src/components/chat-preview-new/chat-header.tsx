import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useChatContext } from './context/chat.context';
import { twoLetters } from '../../lib/utils';

interface ChatHeaderProps {
    onMinimizeClick?: () => void;
}

export const ChatHeader = ({ onMinimizeClick }: ChatHeaderProps) => {
    const {
        webchatEmbedConfig: {
            name,
            description,
            foregroundColor,
            primaryColor,
            logo,
        },
    } = useChatContext();

    return (
        <div
            style={{
                backgroundColor: primaryColor,
                color: foregroundColor,
            }}
            className='flex p-4 rounded-t-xl justify-between items-start'
        >
            <div className='flex items-center gap-3'>
                <Avatar className='text-primary'>
                    <AvatarImage src={logo} />
                    <AvatarFallback>{twoLetters(name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className='text-base font-semibold'>{name}</p>
                    <p className='text-xs'>{description}</p>
                </div>
            </div>
            <div>
                <button onClick={onMinimizeClick}>
                    <ChevronDown />
                </button>
            </div>
        </div>
    );
};

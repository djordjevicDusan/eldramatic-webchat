import { cn, twoLetters } from '../../lib/utils';
import { ActionType, IMessage } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { buttonVariants } from '../ui/button';
import { useChatContext } from './context/chat.context';

export type ChatMessagePosition = 'left' | 'right';

interface ChatMessageProps {
    message: IMessage;
    hideAvatar?: boolean;
    position: ChatMessagePosition;
}

export const ChatMessage = ({
    message,
    position,
    hideAvatar,
}: ChatMessageProps) => {
    const {
        webchatEmbedConfig: { logo, name },
    } = useChatContext();
    const avatarFallback = message.sender === 'user' ? 'User' : name;

    return (
        <div
            className={cn('flex gap-2 items-start', {
                'flex-row-reverse': position === 'right',
            })}
        >
            {avatarFallback && position === 'left' && (
                <Avatar>
                    {!hideAvatar && (
                        <>
                            <AvatarFallback>
                                {twoLetters(avatarFallback)}
                            </AvatarFallback>
                            <AvatarImage src={logo} />
                        </>
                    )}
                </Avatar>
            )}
            <div className='flex items-center gap-2'>
                <StyledMessageWrapper
                    actionType={message.action.type}
                    isLeft={position === 'left'}
                >
                    <MessageContent
                        isLeft={position === 'left'}
                        message={message}
                    />
                </StyledMessageWrapper>
            </div>
        </div>
    );
};

interface StyledMessageWrapperProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    actionType: ActionType;
    isLeft: boolean;
}

const StyledMessageWrapper = ({
    children,
    actionType,
    isLeft,
    ...props
}: StyledMessageWrapperProps) => {
    const commandActions: ActionType[] = ['ai', 'wait'];
    const withoutPadding = actionType === 'image' || actionType === 'card';
    const isCommand = commandActions.includes(actionType);
    const {
        webchatEmbedConfig: { primaryColor, foregroundColor },
    } = useChatContext();

    const styles =
        !isLeft && !isCommand
            ? {
                  backgroundColor: primaryColor,
                  color: foregroundColor,
              }
            : {};

    return (
        <div
            {...props}
            className={cn(
                'text-sm text-primary font-semibold bg-primary-foreground rounded-2xl whitespace-pre-line break-all',
                withoutPadding ? 'rounded-md' : 'p-2 px-4',
                isLeft ? 'rounded-tl-none' : 'rounded-tr-none',
                !isLeft && !isCommand ? 'border-2' : '',
                isCommand
                    ? 'border-2 text-muted-foreground hover:bg-gray-200 hover:border-gray-400 '
                    : ''
            )}
            style={styles}
        >
            {children}
        </div>
    );
};

interface MessageContentProps {
    message: IMessage;
    isLeft: boolean;
}
const MessageContent = ({ message, isLeft }: MessageContentProps) => {
    const {
        webchatEmbedConfig: { foregroundColor },
    } = useChatContext();

    const action = message.action;

    if (action.type === 'message') {
        return <>{action.messages[0]}</>;
    }

    if (action.type === 'image') {
        return <img src={action.url} alt='image' />;
    }

    if (action.type === 'card') {
        const buttonStyles = isLeft
            ? {}
            : { borderColor: foregroundColor, color: foregroundColor };
        const haveButtons =
            action.buttons?.length != null && action.buttons?.length > 0;

        return (
            <div>
                {action.image && <img src={action.image} alt='image' />}
                <div className='p-2 flex gap-3 flex-col'>
                    <div>
                        {action.title && (
                            <h1 className='text-base font-bold'>
                                {action.title}
                            </h1>
                        )}
                        {action.description && (
                            <p className='text-xs'>{action.description}</p>
                        )}
                    </div>
                    {haveButtons && (
                        <div className='flex flex-col gap-2'>
                            {action.buttons?.map((button, index) => {
                                const className = buttonVariants({
                                    variant: 'outline',
                                });

                                return (
                                    <a
                                        href={button.url}
                                        target='_blank'
                                        className={className}
                                        style={buttonStyles}
                                        key={index}
                                    >
                                        {button.label}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <div>UNKNOWN! {message.action.type}</div>;
};

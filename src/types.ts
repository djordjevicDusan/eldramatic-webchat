export type ActionType =
    | 'message'
    | 'wait'
    | 'ai'
    | 'suggestions'
    | 'image'
    | 'card';
export type ButtonType = {
    label: string;
    url: string;
};

export type MessageAction = {
    type: 'message';
    messages: string[];
};
export type WaitAction = {
    type: 'wait';
    delay: number;
};

export type SuggestionsAction = {
    type: 'suggestions';
    suggestions: string[];
};

export type ImageAction = {
    type: 'image';
    url: string;
};

export type CardAction = {
    type: 'card';
    title?: string;
    description?: string;
    image?: string;
    buttons?: ButtonType[];
};

export type AiActionResponseType = 'knowledge_base' | 'general';
export type AiAction = {
    type: 'ai';
    variable?: string;
    responseType: AiActionResponseType;
};

export type Action = {
    id: string;
    type: ActionType;
} & (
    | MessageAction
    | WaitAction
    | AiAction
    | SuggestionsAction
    | ImageAction
    | CardAction
);

export type MessageSender = 'user' | 'automation';
export type MessageType = 'text' | 'html';

export type AutomationPlatform = 'webchat';

export interface IMessage {
    action: Action;
    nodeId: string;
    sender: MessageSender;
}

export interface IWebchatEmbedConfig {
    primaryColor: string;
    foregroundColor: string;
    name: string;
    description: string;
    chatPopupWidth: number;
    chatPopupHeight: number;
    chatTriggerSize: number;
    welcomeMessage?: string;
    welcomeMessageDelay: number;
    logo?: string;
}

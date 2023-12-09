import axios, { AxiosInstance } from 'axios';
import { IMessage } from '../types';

interface IChatHandlerSessionResponse {
    sessionId: string;
    messages: IMessage[];
}

export interface IAPIConfig {
    baseUrl: string;
    apiKey: string;
    automationId: string;
}

export class ChatHandlerAPIService {
    protected axiosInstance: AxiosInstance;

    public constructor(protected config: IAPIConfig) {
        this.axiosInstance = axios.create({
            baseURL: `${config.baseUrl}/api/`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async initChatSession(): Promise<IChatHandlerSessionResponse> {
        const response = await this.axiosInstance.post('chat/new-session', {
            apiKey: this.config.apiKey,
            automationId: this.config.automationId,
        });

        const toRet = response.data as IChatHandlerSessionResponse;

        if (toRet.sessionId == null) {
            throw new Error('SessionId is null');
        }

        return toRet;
    }

    async restoreChatSession(
        sessionId: string
    ): Promise<IChatHandlerSessionResponse | null> {
        try {
            const response = await this.axiosInstance.post(
                'chat/restore-session',
                {
                    apiKey: this.config.apiKey,
                    automationId: this.config.automationId,
                    sessionId,
                }
            );

            const toRet = response.data as IChatHandlerSessionResponse;

            if (toRet.sessionId == null) {
                throw new Error('SessionId is null');
            }

            return toRet;
        } catch (error) {
            return null;
        }
    }

    async sendMessage(
        sessionId: string,
        message: string
    ): Promise<IChatHandlerSessionResponse | null> {
        try {
            const response = await this.axiosInstance.post(
                'chat/send-message',
                {
                    message,
                },
                {
                    headers: {
                        'x-chat-sessionid': sessionId,
                    },
                }
            );

            return response.data as IChatHandlerSessionResponse;
        } catch (error) {
            console.error(error);
        }

        return null;
    }
}

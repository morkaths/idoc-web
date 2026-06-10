import { ApiEndpoint } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import { ApiClient, getAccessToken } from './config';

export interface ChatMessageRequest {
  content: string;
  provider?: string;
  model?: string;
  temperature?: number;
  sessionId?: string;
}

export interface ChatMessageResponse {
  content: string;
  provider: string;
  sources?: string[];
  sessionId?: string;
  role: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const ChatbotApi = {
  /**
   * Gửi tin nhắn đến chatbot (non-streaming)
   */
  chat: (req: ChatMessageRequest): Promise<ApiResponse<ChatMessageResponse>> => {
    return ApiClient.post<ChatMessageResponse>(ApiEndpoint.endpoints.chatbot.chat(), { data: req });
  },

  /**
   * Lấy danh sách các session chat của user
   */
  getSessions: (): Promise<ApiResponse<ChatSession[]>> => {
    return ApiClient.get<ChatSession[]>(ApiEndpoint.endpoints.chatbot.sessions());
  },

  /**
   * Lấy lịch sử chat của một session cụ thể
   */
  getHistory: (sessionId: string): Promise<ApiResponse<ChatMessageResponse[]>> => {
    return ApiClient.get<ChatMessageResponse[]>(ApiEndpoint.endpoints.chatbot.history(sessionId));
  },

  /**
   * Gửi tin nhắn dạng Streaming (Server-Sent Events)
   */
  stream: async function* (req: ChatMessageRequest): AsyncGenerator<string, void, unknown> {
    const url = `${ApiEndpoint.meta.baseURL}${ApiEndpoint.endpoints.chatbot.stream()}`;
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (env.api.key) {
      headers['x-api-key'] = env.api.key;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: req.content,
        provider: req.provider,
        model: req.model,
        temperature: req.temperature,
        session_id: req.sessionId,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Không thể kết nối đến Chatbot Stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataContent = line.slice(6).trim();
          if (dataContent) {
            yield dataContent;
          }
        }
      }
    }
  },
};

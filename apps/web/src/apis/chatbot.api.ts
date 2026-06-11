import { getSession } from 'next-auth/react';
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

  chat: (req: ChatMessageRequest): Promise<ApiResponse<ChatMessageResponse>> => {
    const { sessionId, ...body } = req;
    return ApiClient.post<ChatMessageResponse>(ApiEndpoint.endpoints.chatbot.chat(), {
      data: body,
      params: sessionId ? { sessionId } : undefined,
    });
  },

  getSessions: (): Promise<ApiResponse<ChatSession[]>> => {
    return ApiClient.get<ChatSession[]>(ApiEndpoint.endpoints.chatbot.sessions());
  },

  getHistory: (sessionId: string): Promise<ApiResponse<ChatMessageResponse[]>> => {
    return ApiClient.get<ChatMessageResponse[]>(ApiEndpoint.endpoints.chatbot.history(sessionId));
  },

  stream: async function* (req: ChatMessageRequest): AsyncGenerator<string, void, unknown> {
    const { sessionId, ...body } = req;
    let url = `${ApiEndpoint.meta.baseURL}${ApiEndpoint.endpoints.chatbot.stream()}`;
    if (sessionId) {
      url += `?sessionId=${encodeURIComponent(sessionId)}`;
    }

    let token = getAccessToken();
    if (!token && typeof window !== 'undefined') {
      try {
        const session = await getSession();
        token = session?.accessToken || null;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting session token:', e);
      }
    }

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
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Không thể kết nối đến Chatbot Stream: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let currentEvent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('event: ')) {
          currentEvent = trimmed.slice(7).trim();
        } else if (trimmed.startsWith('data: ')) {
          const dataContent = trimmed.slice(6).trim();
          if (dataContent) {
            if (currentEvent === 'session') {
              currentEvent = '';
              continue;
            }
            if (currentEvent === 'DONE' || dataContent === '[DONE]') {
              currentEvent = '';
              continue;
            }
            yield dataContent;
          }
        }
      }
    }

    if (buffer) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data: ')) {
        const dataContent = trimmed.slice(6).trim();
        if (dataContent && dataContent !== '[DONE]' && currentEvent !== 'session' && currentEvent !== 'DONE') {
          yield dataContent;
        }
      }
    }
  },
};

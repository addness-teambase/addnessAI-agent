import { useState, useCallback, useRef } from 'react';
import { Message } from 'ai';

interface UseDifyChatOptions {
  apiKey: string;
  apiUrl?: string;
}

interface DifyStreamEvent {
  event: string;
  conversation_id?: string;
  message_id?: string;
  answer?: string;
  created_at?: number;
}

export function useDifyChat(options: UseDifyChatOptions) {
  const { apiKey, apiUrl = 'https://api.dify.ai/v1' } = options;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${apiUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: input,
          response_mode: 'streaming',
          conversation_id: conversationId || '',
          user: 'default-user',
          files: [],
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Dify Chat] API Error Response:', errorText);
        throw new Error(`Dify API error: ${response.status} - ${errorText}`);
      }

      console.log('[Dify Chat] Response OK, starting to read stream...');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessageId = '';
      let accumulatedContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              try {
                const event: DifyStreamEvent = JSON.parse(data);
                console.log('[Dify Chat] Event received:', event.event, event);
                
                if (event.event === 'message') {
                  if (event.conversation_id && !conversationId) {
                    setConversationId(event.conversation_id);
                  }
                  if (event.message_id) {
                    assistantMessageId = event.message_id;
                  }
                }
                
                if (event.event === 'agent_message' || event.event === 'message') {
                  if (event.answer) {
                    accumulatedContent += event.answer;
                    
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (lastMessage && lastMessage.role === 'assistant') {
                        lastMessage.content = accumulatedContent;
                      }
                      return newMessages;
                    });
                  }
                }

                if (event.event === 'message_end') {
                  break;
                }
              } catch (parseError) {
                console.error('Failed to parse SSE data:', parseError);
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
      } else {
        console.error('Dify chat error:', error);
        
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'エラーが発生しました。もう一度お試しください。',
          createdAt: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, apiKey, apiUrl, conversationId]);

  const reset = useCallback(() => {
    setMessages([]);
    setInput('');
    setConversationId('');
    setIsLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    reset,
    stop,
    setInput,
    setMessages,
  };
}


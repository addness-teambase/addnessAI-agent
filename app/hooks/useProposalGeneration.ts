import { useState, useCallback, useRef } from 'react';
import { Message } from 'ai';

interface ProposalGenerationParams {
  yakusyoku: string;
  busyo?: string;
  kadai?: string;
}

interface DifyStreamEvent {
  event: string;
  conversation_id?: string;
  message_id?: string;
  answer?: string;
  created_at?: number;
}

export function useProposalGeneration() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateProposal = useCallback(async (params: ProposalGenerationParams) => {
    const { yakusyoku, busyo, kadai } = params;

    if (!yakusyoku || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `役職: ${yakusyoku}\n所属部署: ${busyo || '未設定'}\n課題: ${kadai || '未設定'}`,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/proposal-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yakusyoku,
          busyo,
          kadai,
          conversation_id: conversationId || '',
          user: 'default-user',
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Proposal Generation] API Error Response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      console.log('[Proposal Generation] Response OK, starting to read stream...');
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
                console.log('[Proposal Generation] Event received:', event.event, event);
                
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
        console.error('Proposal generation error:', error);
        
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
  }, [isLoading, conversationId]);

  const reset = useCallback(() => {
    setMessages([]);
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
    isLoading,
    generateProposal,
    reset,
    stop,
    conversationId,
  };
}


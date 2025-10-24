'use client';

import { useChat } from '@ai-sdk/react';
import { AppSidebar } from '@/components/app-sidebar';
import { MainHeader } from '@/app/components/MainHeader';
import { ChatInputArea } from '@/app/components/ChatInputArea';
import { ChatMessage } from './components/ChatMessage';
import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { Message } from 'ai';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import { ModelProvider, useModel } from './components/ModelContext';
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSearchParams } from 'next/navigation';

type UIMessage = Message;

function AppPageContent() {
  const { currentModel } = useModel();
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode');
  const isFAQMode = mode === 'faq-auto-response';
  
  const [conversationId, setConversationId] = useState<string>(`conv-${Date.now()}`);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [difyMessages, setDifyMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; id: string }>>([]);
  const [difyConversationId, setDifyConversationId] = useState<string>('');
  const [isDifyLoading, setIsDifyLoading] = useState(false);

  const [statusText, setStatusText] = useState<string>('');
  const [statusIcon, setStatusIcon] = useState<React.ComponentType<any> | null>(null);

  const sendDifyMessage = async (message: string) => {
    setIsDifyLoading(true);
    
    try {
      const userMessage = {
        role: 'user' as const,
        content: message,
        id: `user-${Date.now()}`
      };
      
      setDifyMessages(prev => [...prev, userMessage]);
      
      const response = await fetch('/api/dify-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId: difyConversationId,
          user: 'user'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage = {
        role: 'assistant' as const,
        content: '',
        id: `assistant-${Date.now()}`
      };
      
      setDifyMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.event === 'message') {
                  assistantMessage.content += data.answer;
                  setDifyMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: assistantMessage.content }
                        : msg
                    )
                  );
                } else if (data.event === 'message_end') {
                  setDifyConversationId(data.conversation_id);
                }
              } catch (e) {
                console.log('Parsing error:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Dify chat error:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'エラーが発生しました。もう一度お試しください。',
        id: `error-${Date.now()}`
      };
      setDifyMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsDifyLoading(false);
    }
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/test-gemini',
    id: conversationId,
    body: {
      model: currentModel,
    },
    maxSteps: 5,
  });

  const isOverallLoading = isFAQMode ? isDifyLoading : isLoading;

  useEffect(() => {
    if (isOverallLoading) {
      setStatusText('思考中...');
      setStatusIcon(() => Sparkles);
    } else {
      setStatusText('');
      setStatusIcon(null);
    }
  }, [isOverallLoading]);

  useEffect(() => {
    if (messages.length === 0) {
      setConversationId(`conv-${Date.now()}`);
    }
  }, [messages.length]);

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFAQMode) {
      if (input.trim()) {
        await sendDifyMessage(input.trim());
        handleInputChange({ target: { value: '' } } as any);
      }
      return;
    }

    if (messages.length === 0) {
      setConversationId(`conv-${Date.now()}`);
    }

    originalHandleSubmit(e, {
      body: {
        model: currentModel,
      }
    });
  };

  const currentMessages = isFAQMode ? difyMessages : messages;

  return (
    <SidebarProvider className="h-screen">
      {isMobile ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <AppSidebar className="hidden md:block" />
      )}
      <SidebarInset className="flex flex-col h-full">
        <MainHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <main className={'w-full flex flex-col overflow-hidden bg-white border-gray-200 transition-all duration-300'}>
            <div className="w-full flex-1 flex flex-col overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-6">
                <div className={`flex-1 flex flex-col ${currentMessages.length === 0 ? 'justify-center items-center' : 'justify-start'} min-h-0`}>
                  <div className="space-y-0 pb-4">
                    {currentMessages.length === 0 && !isOverallLoading && !error && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-center space-y-4">
                          <h1 className="text-3xl font-normal text-gray-800">
                            {isFAQMode ? 'FAQ自動応答' : 'アドネスAIエージェント'}
                          </h1>
                          {isFAQMode && (
                            <p className="text-gray-600">
                              よくある質問にお答えします。何でもお聞きください。
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {currentMessages.map((m, i) => (
                      <ChatMessage
                        key={`${m.id}-${i}`}
                        message={m as UIMessage}
                      />
                    ))}

                    {(() => {
                      const hasAssistantStartedResponse = currentMessages.length > 0 &&
                        currentMessages[currentMessages.length - 1].role === 'assistant' &&
                        currentMessages[currentMessages.length - 1].content.length > 0;

                      const getIconAnimation = (iconComponent: any) => {
                        if (iconComponent === Sparkles) {
                          return "h-5 w-5 text-gray-600 animate-pulse";
                        }
                        return "h-5 w-5 text-gray-600 animate-spin";
                      };

                      return statusText && statusIcon && !hasAssistantStartedResponse && ( 
                        <div className="w-full py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {React.createElement(statusIcon, { className: getIconAnimation(statusIcon) })}
                            </div>
                            <div className="text-gray-600 font-medium">
                              {statusText}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {error && (
            <div className="fixed top-4 right-4 z-50 p-4 max-w-sm w-auto bg-red-100 border border-red-200 text-red-700 rounded-lg shadow-lg">
              <h4 className="font-bold mb-2">エラーが発生しました</h4>
              <p className="text-sm">Error: {error.message}</p>
              <p className="text-xs mt-1 text-red-600">APIキーまたはネットワーク接続を確認してください。</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-white text-red-600 border border-red-300 px-3 py-1 text-xs rounded-md hover:bg-red-50"
              >
                リロード
              </button>
            </div>
          )}
        </div>
        <ChatInputArea
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleCustomSubmit}
          isLoading={isOverallLoading}
          isDeepResearchMode={false}
          onDeepResearchModeChange={() => {}}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
          <span className="text-gray-600">読み込み中...</span>
        </div>
      </div>
    }>
      <AppPageContent />
    </Suspense>
  );
}
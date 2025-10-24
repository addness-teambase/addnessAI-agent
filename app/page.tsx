'use client';

import { useChat } from '@ai-sdk/react';
import { ChatInputArea } from '@/app/components/ChatInputArea';
import { ChatMessage } from './components/ChatMessage';
import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { Message } from 'ai';
import { Sparkles, Home, Users, Menu, MessageSquare, PanelLeft, X, Settings } from 'lucide-react';
import { ModelProvider, useModel } from './components/ModelContext';
import { ModelSelector } from './components/ModelSelector';
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSearchParams, useRouter } from 'next/navigation';

type UIMessage = Message;

function AppPageContent() {
  const { currentModel } = useModel();
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode');
  const isFAQMode = mode === 'faq-auto-response';
  const router = useRouter();
  
  const [conversationId, setConversationId] = useState<string>(`conv-${Date.now()}`);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
                  // 文字ごとに追加（ChatGPTスタイル）
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Sidebar */}
      <div className={`${isMobile ? 'hidden' : sidebarOpen ? 'block' : 'hidden'} fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl z-40 transition-all duration-300`}>
        <div className="h-full flex flex-col">
          {/* Logo & Brand */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">アドネスAI</h1>
                <p className="text-sm text-slate-500">AIエージェント</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-medium">
              <MessageSquare className="w-5 h-5" />
              <span>チャット</span>
            </button>
            <button 
              onClick={() => router.push('/tools')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
            >
              <Users className="w-5 h-5 group-hover:text-blue-600" />
              <span className="font-medium">エージェント一覧</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">AI Agent</p>
                <p className="text-xs text-slate-500">ai@addness.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <div className="h-full bg-white/95 backdrop-blur-xl">
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">アドネスAI</h1>
                      <p className="text-sm text-slate-500">AIエージェント</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 px-4 py-6 space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-medium">
                    <MessageSquare className="w-5 h-5" />
                    <span>チャット</span>
                  </button>
                  <button 
                    onClick={() => router.push('/tools')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">エージェント一覧</span>
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">
                {isFAQMode ? 'FAQ自動応答' : 'チャット'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button */}
      {!isMobile && (
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-4 z-50 p-2 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${sidebarOpen ? 'left-[280px]' : 'left-4'}`}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-slate-600" />
          ) : (
            <PanelLeft className="w-5 h-5 text-slate-600" />
          )}
        </button>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? 'pt-0' : sidebarOpen ? 'pl-72' : 'pl-0'} min-h-screen flex flex-col transition-all duration-300`}>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 flex flex-col bg-gradient-to-br from-white/80 to-slate-50/50 backdrop-blur-sm">
            <div className="w-full flex-1 flex flex-col">
              <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-6 flex-1 flex flex-col">
                <div className={`flex-1 flex flex-col ${currentMessages.length === 0 ? 'justify-center items-center' : 'justify-start'} min-h-0`}>
                  <div className="space-y-0 pb-4 flex-1 flex flex-col">
                    {currentMessages.length === 0 && !isOverallLoading && !error && (
                      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-8">
                        <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
                          <Sparkles className="w-16 h-16 text-white" />
                        </div>
                        <div className="space-y-4">
                          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                            {isFAQMode ? 'FAQ自動応答' : 'アドネスAIエージェント'}
                          </h1>
                          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            {isFAQMode 
                              ? 'よくある質問にお答えします。何でもお聞きください。' 
                              : 'あなたの最高のAIパートナー。何でもお気軽にお聞きください。'
                            }
                          </p>
                          {!isFAQMode && (
                            <div className="flex flex-col items-center gap-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Settings className="w-4 h-4" />
                                <span>AIモデルを選択</span>
                              </div>
                              <ModelSelector />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentMessages.map((m, i) => (
                      <ChatMessage
                        key={`${m.id}-${i}`}
                        message={m as UIMessage}
                        onPreviewOpen={() => {}}
                        onPreviewClose={() => {}}
                        onPreviewWidthChange={() => {}}
                        onBrowserbasePreview={() => {}}
                        onBrowserAutomationDetected={() => {}}
                        deepResearchEvents={[]}
                        isDeepResearchLoading={false}
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
        {/* Chat Input Area */}
        <div className="border-t border-slate-200/50 bg-white/95 backdrop-blur-xl">
          <ChatInputArea
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleCustomSubmit}
            isLoading={isOverallLoading}
            isDeepResearchMode={false}
            onDeepResearchModeChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl mx-auto w-fit">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">読み込み中...</h2>
            <p className="text-slate-600">アドネスAIエージェントを起動しています</p>
          </div>
        </div>
      </div>
    }>
      <ModelProvider>
        <AppPageContent />
      </ModelProvider>
    </Suspense>
  );
}
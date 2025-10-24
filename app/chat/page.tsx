'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { MainHeader } from '@/app/components/MainHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Bot, FileText, Camera, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';

// エージェント情報の定義
const agentConfig = {
  'faq-bot': {
    name: 'FAQボット',
    description: 'よくある質問への自動応答',
    icon: MessageCircle,
    color: 'bg-green-500',
    apiEndpoint: '/api/dify-chat'
  },
};

// チャットメッセージの型
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const agentId = 'faq-bot';
  const agent = agentConfig[agentId];
  
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');

  // 会話IDの初期化
  useEffect(() => {
    if (!conversationId) {
      setConversationId(`conv-${Date.now()}-${agentId}`);
    }
  }, [agentId, conversationId]);

  // メッセージ送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(agent.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: conversationId,
          user: `user-${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let assistantMessageId = `assistant-${Date.now()}`;

      // ストリーミングレスポンスの処理
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.event === 'message' && data.answer) {
                assistantMessage = data.answer;
                
                // リアルタイムでメッセージを更新
                setMessages(prev => {
                  const newMessages = [...prev];
                  const existingIndex = newMessages.findIndex(m => m.id === assistantMessageId);
                  
                  if (existingIndex >= 0) {
                    newMessages[existingIndex] = {
                      id: assistantMessageId,
                      role: 'assistant',
                      content: assistantMessage,
                      timestamp: new Date()
                    };
                  } else {
                    newMessages.push({
                      id: assistantMessageId,
                      role: 'assistant', 
                      content: assistantMessage,
                      timestamp: new Date()
                    });
                  }
                  
                  return newMessages;
                });
              }
            } catch (parseError) {
              console.error('JSON parse error:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {/* エージェント情報ヘッダー */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${agent.color}`}>
                  <agent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{agent.name}</h1>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  オンライン
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* チャットエリア */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
              {/* 初期メッセージ */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={`p-4 rounded-full ${agent.color} mb-4`}>
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {agent.name}とチャットを開始
                  </h2>
                  <p className="text-gray-600 text-center max-w-md">
                    {agent.description}について何でもお聞きください。
                    お手伝いできることがあれば、お気軽にお声かけください。
                  </p>
                </div>
              )}

              {/* メッセージ一覧 */}
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === 'assistant' && (
                      <div className={`p-2 rounded-full ${agent.color} order-0 mr-3 mt-1 flex-shrink-0`}>
                        <agent.icon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* ローディング表示 */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`p-2 rounded-full ${agent.color} mr-3 mt-1 flex-shrink-0`}>
                      <agent.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-3xl">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-gray-500 animate-pulse" />
                          <span className="text-gray-600">回答を生成中...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 入力エリア */}
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`${agent.name}に質問してください...`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  送信
                </button>
              </form>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
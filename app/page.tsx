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
import {
  createConversation,
  getMessages,
  saveMessage,
  autoGenerateTitle,
  supabase,
} from '@/lib/supabase';
import { ConversationList } from './components/ConversationList';

type UIMessage = Message;

function AppPageContent() {
  const { currentModel } = useModel();
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode');
  const isFAQMode = mode === 'faq-auto-response';
  const isContractReviewMode = mode === 'contract-review';
  const isPDFAnalysisMode = mode === 'pdf-analysis';
  const isExcelAnalysisMode = mode === 'excel-analysis';
  const isFileAnalysisMode = isPDFAnalysisMode || isExcelAnalysisMode;
  const isDifyMode = isFAQMode || isContractReviewMode; // FAQと契約書レビューがDifyを使用
  const router = useRouter();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isConversationReady, setIsConversationReady] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [difyMessages, setDifyMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; id: string }>>([]);
  const [difyConversationId, setDifyConversationId] = useState<string>('');
  const [isDifyLoading, setIsDifyLoading] = useState(false);

  const [fileAnalysisMessages, setFileAnalysisMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; id: string }>>([]);
  const [isFileAnalysisLoading, setIsFileAnalysisLoading] = useState(false);

  const [statusText, setStatusText] = useState<string>('');
  const [statusIcon, setStatusIcon] = useState<React.ComponentType<any> | null>(null);

  const sendFileAnalysisMessage = async (file: File, prompt: string) => {
    setIsFileAnalysisLoading(true);
    setStatusText('ファイルを分析中...');
    setStatusIcon(() => Sparkles);

    try {
      // ファイル名とプロンプトを両方表示
      const content = prompt
        ? `📎 ${file.name}\n\n${prompt}`
        : `📎 ${file.name}`;

      const userMessage = {
        role: 'user' as const,
        content: content,
        id: `user-${Date.now()}`,
      };

      setFileAnalysisMessages(prev => [...prev, userMessage]);

      // Supabaseにユーザーメッセージを保存
      if (supabase && conversationId) {
        await saveMessage(
          conversationId,
          'user',
          content,
          { name: file.name, type: file.type, size: file.size }
        );
        await autoGenerateTitle(conversationId);
      }

      console.log('[File Analysis] Analyzing file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        prompt: prompt || '(no prompt)',
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: data.analysis,
          id: `assistant-${Date.now()}`
        };
        setFileAnalysisMessages(prev => [...prev, assistantMessage]);

        // Supabaseにアシスタントメッセージを保存
        if (supabase && conversationId) {
          await saveMessage(conversationId, 'assistant', data.analysis);
        }

        console.log('[File Analysis] Analysis complete:', {
          fileType: data.fileType,
          originalFileType: data.originalFileType,
          processingMode: data.processingMode,
          extractedTextLength: data.extractedTextLength,
          analysisLength: data.analysis.length,
        });
      } else {
        throw new Error(data.details || data.error || '分析に失敗しました');
      }
    } catch (error) {
      console.error('[File Analysis] Error:', error);

      let errorContent = 'エラーが発生しました。';
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorContent = '⚠️ Gemini API キーが設定されていません。環境変数を確認してください。';
        } else if (error.message.includes('quota')) {
          errorContent = '⚠️ API の使用量制限に達しました。しばらく待ってから再度お試しください。';
        } else if (error.message.includes('timeout')) {
          errorContent = '⚠️ ファイルの分析に時間がかかりすぎました。より小さいファイルでお試しください。';
        } else if (error.message.includes('unsupported')) {
          errorContent = '⚠️ このファイル形式はサポートされていません。';
        } else {
          errorContent = `エラー: ${error.message}`;
        }
      }

      const errorMessage = {
        role: 'assistant' as const,
        content: errorContent,
        id: `error-${Date.now()}`
      };
      setFileAnalysisMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsFileAnalysisLoading(false);
      setStatusText('');
      setStatusIcon(null);
    }
  };

  const sendDifyMessage = async (message: string, file?: File) => {
    setIsDifyLoading(true);
    setStatusText('処理中...');
    setStatusIcon(() => Sparkles);

    try {
      let fileIds: Array<{ type: string; transfer_method: string; upload_file_id: string }> = [];

      // ファイルがある場合は、Difyにアップロード
      if (file) {
        console.log('[Dify] Uploading file to Dify:', file.name);
        setStatusText('ファイルをアップロード中...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mode', mode || '');

        const uploadResponse = await fetch('/api/dify-upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('[Dify] Upload failed:', errorText);
          throw new Error(`ファイルのアップロードに失敗しました: ${errorText}`);
        }

        const uploadData = await uploadResponse.json();
        console.log('[Dify] Upload response:', uploadData);

        if (uploadData.id) {
          // Difyのファイル形式に変換
          fileIds = [{
            type: 'document',
            transfer_method: 'local_file',
            upload_file_id: uploadData.id,
          }];
          console.log('[Dify] File uploaded successfully:', {
            id: uploadData.id,
            name: file.name,
            fileIds: fileIds,
          });
        } else {
          console.error('[Dify] No file ID in response:', uploadData);
          throw new Error(uploadData.error || 'ファイルのアップロードに失敗しました（IDが返されませんでした）');
        }
      }

      const userMessage = {
        role: 'user' as const,
        content: file ? `📎 ${file.name}\n\n${message || 'このファイルをレビューしてください'}` : message,
        id: `user-${Date.now()}`,
      };

      setDifyMessages(prev => [...prev, userMessage]);
      setStatusText('AIが応答中...');

      // Supabaseにユーザーメッセージを保存
      if (supabase && conversationId) {
        await saveMessage(
          conversationId,
          'user',
          userMessage.content,
          file ? { name: file.name, type: file.type, size: file.size } : undefined
        );

        // タイトルが「新しい会話」の場合、自動生成
        await autoGenerateTitle(conversationId);
      }

      // メッセージとファイルの両方がない場合はエラー
      if (!message.trim() && fileIds.length === 0) {
        throw new Error('メッセージまたはファイルが必要です');
      }

      const requestPayload = {
        message: message || 'このファイルをレビューしてください',
        conversationId: difyConversationId,
        user: 'user',
        mode: mode,
        files: fileIds, // DifyにアップロードしたファイルIDを送信
      };

      console.log('[Dify] Sending message:', {
        mode,
        messageLength: message.length,
        conversationId: difyConversationId,
        hasFile: !!file,
        fileIdsCount: fileIds.length,
        payload: requestPayload,
      });

      const response = await fetch('/api/dify-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Dify Chat] Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          requestPayload: requestPayload,
        });

        // エラーメッセージをパース
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.details) {
            const details = typeof errorData.details === 'string'
              ? JSON.parse(errorData.details)
              : errorData.details;
            errorMessage = details.message || errorData.error || errorMessage;
          }
        } catch (e) {
          // JSON parse error - use text as is
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
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

                  // Supabaseにアシスタントメッセージを保存（ストリーミング完了時）
                  if (supabase && conversationId && assistantMessage.content) {
                    await saveMessage(conversationId, 'assistant', assistantMessage.content);
                  }
                }
              } catch (e) {
                console.log('Parsing error:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[Dify] Chat error:', error);
      console.error('[Dify] Stack trace:', error instanceof Error ? error.stack : 'No stack');

      let errorContent = 'エラーが発生しました。';

      if (error instanceof Error) {
        console.error('[Dify] Error details:', {
          message: error.message,
          name: error.name,
        });

        if (error.message.includes('アップロード')) {
          errorContent = '⚠️ ファイルのアップロードに失敗しました。\n\n原因：\n- ファイル形式がサポートされていない可能性があります\n- ファイルサイズが大きすぎる可能性があります\n- ネットワークエラーの可能性があります\n\nもう一度お試しください。';
        } else if (error.message.includes('docs is required')) {
          errorContent = '⚠️ Dify設定エラー：ファイルパラメータが不足しています。\n\n管理者に以下を確認してください：\n- Difyワークフローで「docs」入力変数が正しく設定されているか\n- ファイルアップロード機能が有効になっているか';
        } else if (error.message.includes('invalid_param')) {
          errorContent = '⚠️ パラメータエラー：Dify APIへのリクエストが正しくありません。\n\n管理者に連絡してください。\n詳細: ' + error.message;
        } else if (error.message.includes('400')) {
          errorContent = '⚠️ リクエストエラー（400）：送信データに問題があります。\n\n詳細: ' + error.message + '\n\n管理者に連絡してください。';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorContent = '⚠️ API認証エラーです。\n\nAPIキーが正しく設定されているか管理者に確認してください。';
        } else if (error.message.includes('メッセージまたはファイルが必要')) {
          errorContent = '⚠️ メッセージを入力するか、ファイルを添付してください。';
        } else {
          errorContent = `⚠️ エラーが発生しました\n\n${error.message}\n\n詳細はコンソールログを確認してください。`;
        }
      }

      const errorMessage = {
        role: 'assistant' as const,
        content: errorContent,
        id: `error-${Date.now()}`
      };
      setDifyMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsDifyLoading(false);
      setStatusText('');
      setStatusIcon(null);
    }
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    append,
    isLoading,
    error,
    setInput,
  } = useChat({
    api: '/api/test-gemini',
    id: conversationId || undefined,
    body: {
      model: currentModel.modelName, // モデル名の文字列を送信
      mode: mode, // モードを渡す（契約書レビューなど）
    },
    maxSteps: 5,
    onFinish: async (message) => {
      // 通常モードの場合、メッセージをSupabaseに保存
      if (supabase && conversationId && !isDifyMode && !isFileAnalysisMode) {
        // AI応答を保存
        await saveMessage(conversationId, 'assistant', message.content);
        // タイトル自動生成
        await autoGenerateTitle(conversationId);
      }
    },
  });

  const isOverallLoading = isDifyMode ? isDifyLoading : isFileAnalysisMode ? isFileAnalysisLoading : isLoading;

  useEffect(() => {
    if (isOverallLoading) {
      setStatusText('思考中...');
      setStatusIcon(() => Sparkles);
    } else {
      setStatusText('');
      setStatusIcon(null);
    }
  }, [isOverallLoading]);

  // 会話の初期化（マウント時に新しい会話を作成）
  useEffect(() => {
    const initConversation = async () => {
      if (conversationId) return; // 既に会話がある場合はスキップ

      if (supabase) {
        // Supabaseが有効な場合、新しい会話を作成
        const newConv = await createConversation(
          '新しい会話',
          mode || null,
          currentModel.modelName
        );
        if (newConv) {
          setConversationId(newConv.id);
        }
      } else {
        // Supabaseが無効な場合、ローカルIDを使用
        setConversationId(`local-${Date.now()}`);
      }
      setIsConversationReady(true);
    };

    initConversation();
  }, [conversationId, mode, currentModel.modelName]);

  // 新しい会話を作成
  const handleNewConversation = async () => {
    if (supabase) {
      const newConv = await createConversation(
        '新しい会話',
        mode || null,
        currentModel.modelName
      );
      if (newConv) {
        setConversationId(newConv.id);
      }
    } else {
      setConversationId(`local-${Date.now()}`);
    }

    // メッセージをクリア
    setDifyMessages([]);
    setFileAnalysisMessages([]);
    setInput('');
  };

  // 既存の会話を読み込む
  const handleLoadConversation = async (convId: string) => {
    setConversationId(convId);

    if (supabase) {
      const messages = await getMessages(convId);

      // モードに応じてメッセージを設定
      const formattedMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        id: msg.id,
      }));

      if (isDifyMode) {
        setDifyMessages(formattedMessages);
      } else if (isFileAnalysisMode) {
        setFileAnalysisMessages(formattedMessages);
      }
      // 通常モードの場合は、useChatが自動的に管理するためここでは設定しない
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>, file?: File) => {
    e.preventDefault();

    // ファイル分析モードの場合
    if (isFileAnalysisMode) {
      if (file) {
        await sendFileAnalysisMessage(file, input);
        handleInputChange({ target: { value: '' } } as any);
      }
      return;
    }

    // Difyモードの場合
    if (isDifyMode) {
      // ファイルがあるか、入力がある場合に送信
      if (file || input.trim()) {
        await sendDifyMessage(input.trim(), file);
        handleInputChange({ target: { value: '' } } as any);
      }
      return;
    }

    if (messages.length === 0) {
      setConversationId(`conv-${Date.now()}`);
    }

    // Supabaseにユーザーメッセージを保存（通常モード）
    if (supabase && conversationId) {
      await saveMessage(
        conversationId,
        'user',
        input,
        file ? { name: file.name, type: file.type, size: file.size } : undefined
      );
    }

    // ファイルが添付されている場合、appendを使って送信
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        await append(
          {
            role: 'user',
            content: input,
          },
          {
            experimental_attachments: [
              {
                name: file.name,
                contentType: file.type,
                url: reader.result as string,
              },
            ],
            body: {
              model: currentModel.modelName,
              mode: mode, // モードを渡す
            }
          }
        );

        setInput('');
      };
      reader.readAsDataURL(file);
    } else {
      // ファイルなしの場合は従来通り
      originalHandleSubmit(e, {
        body: {
          model: currentModel.modelName,
          mode: mode, // モードを渡す
        }
      });
    }
  };

  const currentMessages = isDifyMode ? difyMessages : isFileAnalysisMode ? fileAnalysisMessages : messages;

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
                <h1 className="text-xl font-bold text-slate-900">Addness AI Agent</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-3 space-y-2">
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

          {/* 会話履歴（Supabaseが有効な場合のみ表示） */}
          {supabase && (
            <div className="flex-1 overflow-hidden border-t border-slate-100">
              <ConversationList
                currentConversationId={conversationId}
                onConversationSelect={handleLoadConversation}
                onNewConversation={handleNewConversation}
              />
            </div>
          )}

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">AIエージェント</p>
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
                      <h1 className="text-xl font-bold text-slate-900">Addness AI Agent</h1>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-2">
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

                {/* 会話履歴（Supabaseが有効な場合のみ表示） */}
                {supabase && (
                  <div className="flex-1 overflow-hidden border-t border-slate-100">
                    <ConversationList
                      currentConversationId={conversationId}
                      onConversationSelect={(convId) => {
                        handleLoadConversation(convId);
                        setIsMobileMenuOpen(false);
                      }}
                      onNewConversation={() => {
                        handleNewConversation();
                        setIsMobileMenuOpen(false);
                      }}
                    />
                  </div>
                )}
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
                {isFAQMode ? 'FAQ自動応答' : isContractReviewMode ? '契約書レビュー' : isPDFAnalysisMode ? 'PDF分析' : isExcelAnalysisMode ? 'Excel分析' : 'チャット'}
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
                          <h1 className="text-5xl font-bold leading-[1.2] pb-1">
                            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent inline-block py-1">
                              {isFAQMode ? 'FAQ自動応答' : isContractReviewMode ? '契約書レビュー' : isPDFAnalysisMode ? 'PDF分析' : isExcelAnalysisMode ? 'Excel分析' : 'Addness AI Agent'}
                            </span>
                          </h1>
                          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            {isFAQMode
                              ? 'よくある質問にお答えします。何でもお聞きください。'
                              : isContractReviewMode
                              ? '契約書を分析し、リスクをチェックします。'
                              : isPDFAnalysisMode
                              ? 'PDFファイルをAIが詳細に分析します。'
                              : isExcelAnalysisMode
                              ? 'Excel/CSVデータをAIが詳細に分析します。'
                              : 'あなたの最高のAIパートナー。何でもお気軽にお聞きください。'
                            }
                          </p>
                          {!isDifyMode && !isFileAnalysisMode && !isContractReviewMode && (
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
                        onPreviewOpen={() => { }}
                        onPreviewClose={() => { }}
                        onPreviewWidthChange={() => { }}
                        onBrowserbasePreview={() => { }}
                        onBrowserAutomationDetected={() => { }}
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
              <p className="text-sm">エラー: {error.message}</p>
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
            onDeepResearchModeChange={() => { }}
            isDifyMode={isDifyMode}
            isFileAnalysisMode={isFileAnalysisMode}
            fileAnalysisType={isPDFAnalysisMode ? 'pdf' : isExcelAnalysisMode ? 'excel' : undefined}
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
            <p className="text-slate-600">Addness AI Agent を起動しています</p>
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
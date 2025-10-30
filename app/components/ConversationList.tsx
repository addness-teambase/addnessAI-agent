'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { Conversation, getConversations, deleteConversation } from '@/lib/supabase';

interface ConversationListProps {
  currentConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 会話一覧を読み込み
  const loadConversations = async () => {
    setIsLoading(true);
    const data = await getConversations();
    setConversations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 会話を削除
  const handleDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('この会話を削除しますか？')) return;

    await deleteConversation(conversationId);
    await loadConversations();

    // 削除した会話が現在の会話の場合、新しい会話を作成
    if (conversationId === currentConversationId) {
      onNewConversation();
    }
  };

  // モード名を日本語に変換
  const getModeLabel = (mode: string | null) => {
    if (!mode) return null;
    const modeLabels: Record<string, string> = {
      'faq-auto-response': 'FAQ',
      'contract-review': '契約書',
      'pdf-analysis': 'PDF',
      'excel-analysis': 'Excel',
    };
    return modeLabels[mode] || mode;
  };

  return (
    <div className="flex flex-col h-full">
      {/* 新しい会話ボタン */}
      <div className="p-3 border-b border-slate-100">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">新しい会話</span>
        </button>
      </div>

      {/* 会話一覧 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {isLoading ? (
          <div className="text-center py-4 text-sm text-slate-500">読み込み中...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4 text-sm text-slate-500">
            まだ会話がありません
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onConversationSelect(conv.id)}
              className={`group relative flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                currentConversationId === conv.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {conv.title}
                  </p>
                  {getModeLabel(conv.mode) && (
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {getModeLabel(conv.mode)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(conv.updated_at).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                title="削除"
              >
                <Trash2 className="w-3 h-3 text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase環境変数が設定されていません。会話履歴機能が無効です。');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// データベース型定義
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: string | null;
  model_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  metadata?: any;
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

// ユーザーIDを取得（認証なしの場合はローカルストレージのID）
export function getUserId(): string {
  if (typeof window === 'undefined') return 'server-side';

  let userId = localStorage.getItem('supabase_user_id');
  if (!userId) {
    userId = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('supabase_user_id', userId);
  }
  return userId;
}

// 会話一覧を取得
export async function getConversations(): Promise<Conversation[]> {
  if (!supabase) return [];

  const userId = getUserId();

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('会話一覧の取得エラー:', error);
    return [];
  }

  return data || [];
}

// 特定の会話のメッセージを取得
export async function getMessages(conversationId: string): Promise<Message[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('メッセージ取得エラー:', error);
    return [];
  }

  return data || [];
}

// 新しい会話を作成
export async function createConversation(
  title: string = '新しい会話',
  mode: string | null = null,
  modelName: string | null = null
): Promise<Conversation | null> {
  if (!supabase) return null;

  const userId = getUserId();

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title,
      mode,
      model_name: modelName,
    })
    .select()
    .single();

  if (error) {
    console.error('会話作成エラー:', error);
    return null;
  }

  return data;
}

// メッセージを保存
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  file?: {
    name: string;
    type: string;
    size: number;
  },
  metadata?: any
): Promise<Message | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      file_name: file?.name,
      file_type: file?.type,
      file_size: file?.size,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('メッセージ保存エラー:', error);
    return null;
  }

  return data;
}

// 会話のタイトルを更新
export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<void> {
  if (!supabase) return;

  const userId = getUserId();

  const { error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    console.error('タイトル更新エラー:', error);
  }
}

// 会話を削除
export async function deleteConversation(conversationId: string): Promise<void> {
  if (!supabase) return;

  const userId = getUserId();

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    console.error('会話削除エラー:', error);
  }
}

// 会話の最初のメッセージからタイトルを自動生成
export async function autoGenerateTitle(conversationId: string): Promise<void> {
  if (!supabase) return;

  const messages = await getMessages(conversationId);
  const firstUserMessage = messages.find(m => m.role === 'user');

  if (firstUserMessage) {
    let title = firstUserMessage.content.substring(0, 50);
    if (firstUserMessage.content.length > 50) {
      title += '...';
    }
    await updateConversationTitle(conversationId, title);
  }
}

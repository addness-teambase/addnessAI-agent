-- ============================================
-- Addness AI Agent - Supabase Database Schema
-- ============================================
-- すべてのエージェント（通常チャット、Dify、ファイル分析）対応
-- ChatGPTスタイルの会話履歴管理

-- 1. 会話テーブル
-- ============================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null, -- ユーザー識別子（認証前は匿名ID、認証後はAuth UID）
  title text not null default '新しい会話', -- 会話タイトル（最初のメッセージから自動生成）
  mode text, -- チャットモード: null（通常）、'faq-auto-response'、'contract-review'、'pdf-analysis'、'excel-analysis'
  model_name text, -- 使用AIモデル: 'gpt-4o'、'gemini-2.0-flash-exp'、'claude-3-5-sonnet'、'grok-2'など
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 会話の検索用インデックス
create index if not exists conversations_user_id_idx on conversations(user_id);
create index if not exists conversations_created_at_idx on conversations(created_at desc);
create index if not exists conversations_mode_idx on conversations(mode);

-- 2. メッセージテーブル
-- ============================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade, -- 会話が削除されたらメッセージも削除
  role text not null check (role in ('user', 'assistant', 'system')), -- メッセージの役割
  content text not null, -- メッセージ本文
  file_name text, -- 添付ファイル名（オプション）
  file_type text, -- ファイルタイプ: 'image/png'、'application/pdf'など
  file_size integer, -- ファイルサイズ（バイト）
  metadata jsonb, -- 追加メタデータ（ツール実行結果、エラー情報など）
  created_at timestamp with time zone default now()
);

-- メッセージの検索用インデックス
create index if not exists messages_conversation_id_idx on messages(conversation_id);
create index if not exists messages_created_at_idx on messages(created_at);
create index if not exists messages_role_idx on messages(role);

-- 3. 自動更新トリガー
-- ============================================
-- 会話の updated_at を自動更新
create or replace function update_conversation_updated_at()
returns trigger as $$
begin
  update conversations
  set updated_at = now()
  where id = NEW.conversation_id;
  return NEW;
end;
$$ language plpgsql;

create trigger update_conversation_timestamp
  after insert on messages
  for each row
  execute function update_conversation_updated_at();

-- 4. Row Level Security (RLS) ポリシー
-- ============================================
-- 注意: 開発段階では、RLSを無効にすることを推奨します
-- 本番環境では、Supabase Authと連携してRLSを有効化してください

-- 開発用: RLSを無効化（全ユーザーがアクセス可能）
-- alter table conversations enable row level security;
-- alter table messages enable row level security;

-- 本番環境用: RLSを有効化する場合はコメントを外す
/*
alter table conversations enable row level security;
alter table messages enable row level security;

-- 全ユーザーがアクセス可能（開発用）
create policy "Enable all access for conversations"
  on conversations for all
  using (true)
  with check (true);

create policy "Enable all access for messages"
  on messages for all
  using (true)
  with check (true);

-- または、Supabase Authを使用する場合:
-- create policy "Users can access their own conversations"
--   on conversations for all
--   using (auth.uid()::text = user_id)
--   with check (auth.uid()::text = user_id);
--
-- create policy "Users can access messages in their conversations"
--   on messages for all
--   using (
--     conversation_id in (
--       select id from conversations where auth.uid()::text = user_id
--     )
--   )
--   with check (
--     conversation_id in (
--       select id from conversations where auth.uid()::text = user_id
--     )
--   );
*/

-- 5. 便利なビュー
-- ============================================
-- 会話一覧（最新メッセージとメッセージ数を含む）
create or replace view conversation_list as
select
  c.id,
  c.user_id,
  c.title,
  c.mode,
  c.model_name,
  c.created_at,
  c.updated_at,
  count(m.id) as message_count,
  (
    select content
    from messages
    where conversation_id = c.id
    order by created_at desc
    limit 1
  ) as last_message
from conversations c
left join messages m on c.id = m.conversation_id
group by c.id
order by c.updated_at desc;

-- 6. 便利な関数
-- ============================================
-- 会話タイトルを自動生成（最初のユーザーメッセージから）
create or replace function generate_conversation_title(conversation_uuid uuid)
returns text as $$
declare
  first_message text;
  generated_title text;
begin
  -- 最初のユーザーメッセージを取得
  select content into first_message
  from messages
  where conversation_id = conversation_uuid and role = 'user'
  order by created_at
  limit 1;

  -- タイトル生成（最初の50文字）
  if first_message is not null then
    generated_title := substring(first_message from 1 for 50);
    if length(first_message) > 50 then
      generated_title := generated_title || '...';
    end if;
    return generated_title;
  else
    return '新しい会話';
  end if;
end;
$$ language plpgsql;

-- 7. サンプルデータ（開発用・任意）
-- ============================================
-- コメントを外してサンプルデータを挿入
/*
insert into conversations (user_id, title, mode, model_name) values
  ('demo-user', 'プレゼンテーション作成について', null, 'gemini-2.0-flash-exp'),
  ('demo-user', '契約書のリスクチェック', 'contract-review', 'gpt-4o'),
  ('demo-user', 'PDFファイルの分析', 'pdf-analysis', 'gemini-2.0-flash-exp');

insert into messages (conversation_id, role, content) values
  ((select id from conversations where title = 'プレゼンテーション作成について'), 'user', 'スライドを作成してください'),
  ((select id from conversations where title = 'プレゼンテーション作成について'), 'assistant', 'かしこまりました。どのようなテーマのスライドを作成しますか？');
*/

-- ============================================
-- セットアップ完了
-- ============================================
-- 次のステップ:
-- 1. SupabaseダッシュボードでこのSQLを実行
-- 2. 環境変数に以下を追加:
--    NEXT_PUBLIC_SUPABASE_URL=your-project-url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
-- 3. npm install @supabase/supabase-js

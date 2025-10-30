# Supabase 会話履歴機能セットアップガイド

ChatGPTスタイルの会話履歴機能をSupabaseで実装するためのセットアップガイドです。

## 📋 機能概要

- ✅ すべてのエージェント（通常チャット、Dify、ファイル分析）の会話履歴を保存
- ✅ ChatGPTスタイルのサイドバーUI
- ✅ 会話の作成・読み込み・削除
- ✅ 自動タイトル生成
- ✅ ファイル添付情報も保存
- ✅ ページリロードしても会話が残る

## 🚀 セットアップ手順

### 1. Supabaseプロジェクトを作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. プロジェクト設定:
   - **Project name**: `addness-ai-agent`（任意）
   - **Database Password**: 強力なパスワードを設定（必ず保存！）
   - **Region**: `Northeast Asia (Tokyo)` 推奨
4. 「Create new project」をクリック（1-2分かかります）

### 2. SQLスキーマを実行

1. Supabaseダッシュボード → 左メニューの **「SQL Editor」** をクリック
2. `supabase-schema.sql` の内容をコピー
3. SQL Editorにペースト
4. **「Run」** ボタンをクリック
5. 成功メッセージが表示されればOK！

### 3. 環境変数を設定

1. Supabaseダッシュボード → **Settings** → **API**
2. 以下の2つをコピー:
   - **Project URL**
   - **anon/public key**

3. プロジェクトルートの `.env.local` ファイルに追加:

```bash
# Supabase 会話履歴機能
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**例:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. アプリケーションを起動

```bash
# Terminal 1: Mastraサーバー
npm run dev:mastra

# Terminal 2: Next.jsアプリ
npm run dev
```

### 5. 動作確認

1. http://localhost:3000 にアクセス
2. サイドバーに「新しい会話」ボタンが表示される
3. メッセージを送信すると、サイドバーに会話が追加される
4. ページをリロードしても会話が残っている

✅ **成功！** ChatGPTスタイルの会話履歴機能が動作しています。

---

## 🎨 使い方

### 新しい会話を作成

サイドバーの **「新しい会話」** ボタンをクリック

### 過去の会話を開く

サイドバーの会話一覧から選択

### 会話を削除

会話にホバーして、ゴミ箱アイコンをクリック

### タイトルの自動生成

最初のメッセージを送信すると、自動的にタイトルが生成されます

---

## 🔧 トラブルシューティング

### 会話履歴が表示されない

**原因**: 環境変数が設定されていない

**解決策**:
1. `.env.local` ファイルに `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を追加
2. サーバーを再起動 (`npm run dev`)

### SQLエラーが発生する

**原因**: テーブルが既に存在している

**解決策**:
1. Supabaseダッシュボード → **Table Editor**
2. `conversations` と `messages` テーブルを削除
3. SQL Editorで再度 `supabase-schema.sql` を実行

### 「RLS policy violation」エラー

**原因**: Row Level Security (RLS) が有効になっている

**解決策**:
開発段階では、RLSを無効にすることを推奨します。

Supabaseダッシュボード → **Authentication** → **Policies** で以下を確認:
- `conversations` テーブル: RLS が無効（デフォルト）
- `messages` テーブル: RLS が無効（デフォルト）

---

## 📊 データベース構造

### `conversations` テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 会話ID（主キー） |
| user_id | text | ユーザーID（匿名ID） |
| title | text | 会話タイトル |
| mode | text | モード（null/faq/contract/pdf/excel） |
| model_name | text | 使用AIモデル |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

### `messages` テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | メッセージID（主キー） |
| conversation_id | uuid | 会話ID（外部キー） |
| role | text | 役割（user/assistant/system） |
| content | text | メッセージ本文 |
| file_name | text | 添付ファイル名 |
| file_type | text | ファイルタイプ |
| file_size | integer | ファイルサイズ |
| metadata | jsonb | 追加メタデータ |
| created_at | timestamp | 作成日時 |

---

## 🔐 セキュリティ（本番環境）

開発段階では、RLSを無効にしていますが、本番環境では以下を実装してください:

### Supabase Authとの連携

```sql
-- RLSを有効化
alter table conversations enable row level security;
alter table messages enable row level security;

-- 認証済みユーザーのみアクセス可能
create policy "Users can access their own conversations"
  on conversations for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);

create policy "Users can access messages in their conversations"
  on messages for all
  using (
    conversation_id in (
      select id from conversations where auth.uid()::text = user_id
    )
  )
  with check (
    conversation_id in (
      select id from conversations where auth.uid()::text = user_id
    )
  );
```

---

## 🎉 完成！

これで、すべてのエージェントモードで会話履歴が永続化され、ChatGPTスタイルのUIで管理できるようになりました。

質問や問題がある場合は、[GitHub Issues](https://github.com/your-repo/issues) でお知らせください。

# Vercelデプロイ完全ガイド

このガイドに従うことで、アドネスAIエージェントをVercelに正しくデプロイできます。

---

## 📝 デプロイ前のチェックリスト

### ✅ 必須事項

- [ ] GitHubリポジトリにプッシュ済み
- [ ] すべてのAPIキーを取得済み
- [ ] ローカル環境で動作確認済み
- [ ] `npm run build` が成功する

---

## 🚀 ステップ1: Vercelプロジェクトの作成

### 1-1. Vercelにログイン

```bash
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# Vercelにログイン
vercel login
```

または、[Vercel Dashboard](https://vercel.com/dashboard)からGUIで操作。

### 1-2. プロジェクトのインポート

1. Vercel Dashboard → **"Add New Project"**
2. GitHubリポジトリを選択
3. プロジェクト名を入力（例: `addness-ai-agent`）
4. Framework Preset: **Next.js** を選択
5. Root Directory: `.` (デフォルト)

---

## 🔐 ステップ2: 環境変数の設定（超重要！）

Vercel Dashboard → プロジェクト → **Settings** → **Environment Variables**

### 必須のAPI キー

#### 🌟 Google Gemini API（必須）
```
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s
GEMINI_API_KEY=AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s
```

#### 🤖 Dify API（FAQボット用・必須）
```
DIFY_API_KEY=app-uyTWjRVJlh6NhZp1WYbJproQ
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_FAQ_APP_ID=your_app_id_here
```

### オプションのAPI キー

#### 🧠 その他のAIモデル（オプション）
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
XAI_API_KEY=your_xai_api_key_here
```

#### 🎨 メディア生成（オプション）
```
FAL_KEY=your_fal_key_here
MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_GROUP_ID=your_minimax_group_id_here
```

#### 🌐 ブラウザ自動化（オプション）
```
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here
```

#### 🔍 検索API（オプション）
```
BRAVE_API_KEY=your_brave_api_key_here
```

### システム設定
```
NODE_ENV=production
HOSTNAME=localhost
NODE_OPTIONS=--dns-result-order=ipv4first
```

---

## ⚙️ ステップ3: ビルド設定

### vercel.json を作成（推奨）

プロジェクトルートに `vercel.json` を作成：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**重要な設定:**
- `regions: ["hnd1"]` - 東京リージョンを使用（低レイテンシ）
- `NODE_ENV: "production"` - 本番環境として実行

---

## 🎯 ステップ4: Mastra関連の注意事項

### Mastraサーバーについて

**重要:** Vercelでは**常時起動のサーバープロセスは実行できません**。

以下の2つのアプローチがあります：

#### アプローチA: サーバーレス化（推奨）

Mastraのツールを**API Routes**として実装：

1. Mastraサーバーを起動しない
2. すべてのツールをNext.js API Routesで実装
3. 現在の実装で既に対応済み ✅

#### アプローチB: 外部サーバー使用

Mastraサーバーを別のプラットフォームでホスト：

1. [Railway](https://railway.app/)
2. [Render](https://render.com/)
3. VPS（さくらVPS、ConoHa等）

**現在の実装では、アプローチAで動作します。**

---

## 📦 ステップ5: デプロイ実行

### 方法1: Vercel Dashboard（推奨）

1. Vercel Dashboard → プロジェクト
2. **"Deployments"** タブ
3. **"Redeploy"** または GitHubにpushで自動デプロイ

### 方法2: Vercel CLI

```bash
# プロジェクトルートで実行
vercel

# 本番環境へデプロイ
vercel --prod
```

---

## 🧪 ステップ6: デプロイ後の動作確認

### 6-1. 基本的な動作確認

```bash
# GeminiテストAPI
curl https://your-app.vercel.app/api/test-gemini

# 期待されるレスポンス
{
  "success": true,
  "response": "こんにちは (Konnichiwa)!",
  "message": "Gemini API is working correctly"
}
```

### 6-2. チャット機能の確認

1. `https://your-app.vercel.app/` を開く
2. モデル選択（Gemini 2.5 Flash）
3. メッセージを送信
4. レスポンスが返ってくることを確認

### 6-3. FAQボットの確認

1. `https://your-app.vercel.app/tools` を開く
2. 「FAQ自動応答」をクリック
3. 質問を送信
4. Dify APIからレスポンスが返ることを確認

---

## 🐛 トラブルシューティング

### エラー1: "API key not found"

**原因:** 環境変数が設定されていない

**解決策:**
1. Vercel Dashboard → Settings → Environment Variables
2. 必要な環境変数を追加
3. Redeploy

### エラー2: ビルドが失敗する

**原因:** 依存関係の問題

**解決策:**
```bash
# ローカルでビルドテスト
npm run build

# エラーが出たら修正してからデプロイ
```

### エラー3: "Module not found"

**原因:** package.jsonの依存関係が不足

**解決策:**
```bash
# 必要なパッケージをインストール
npm install

# package.jsonを確認
cat package.json
```

### エラー4: APIレスポンスが遅い

**原因:** リージョンが遠い、またはコールドスタート

**解決策:**
1. `vercel.json` で `regions: ["hnd1"]` を設定
2. Vercel Pro プランでコールドスタートを短縮

### エラー5: "conversation_id is not a valid uuid"

**原因:** UUIDの形式が不正

**解決策:** 既に修正済み ✅
- `app/chat/page.tsx` でUUID v4を生成
- 初回は空の `conversation_id` を送信

---

## 📊 パフォーマンス最適化

### 1. Edge Functions の活用

`app/api/*/route.ts` に以下を追加：

```typescript
export const runtime = 'edge'; // すでに一部で使用中
```

**メリット:**
- レスポンス時間の短縮
- グローバル分散

### 2. Streaming の活用

現在の実装で既に使用中 ✅

```typescript
return result.toDataStreamResponse(); // Gemini API
return new NextResponse(difyResponse.body); // Dify API
```

### 3. キャッシュの設定

静的ファイルのキャッシュ（`next.config.js` で既に設定済み）

---

## 🔒 セキュリティのベストプラクティス

### 1. APIキーの保護

- ✅ クライアント側に公開しない
- ✅ サーバーサイド（API Routes）でのみ使用
- ✅ Vercelの環境変数で管理

### 2. CORS設定

現在の実装で適切に設定済み ✅

### 3. レート制限

将来的に実装推奨：

```typescript
// middleware.ts で実装
import { Ratelimit } from "@upstash/ratelimit";
```

---

## 📈 モニタリング

### Vercel Analytics

1. Vercel Dashboard → プロジェクト
2. **"Analytics"** タブ
3. トラフィック、エラー率を確認

### ログの確認

```bash
# Vercel CLIでログを確認
vercel logs
```

---

## 🔄 継続的デプロイ（CD）

### GitHubとの連携

1. GitHubにpush
2. Vercelが自動的にビルド＆デプロイ
3. プレビューURLが生成される

### ブランチ戦略

- `main` ブランチ → 本番環境
- `develop` ブランチ → ステージング環境
- Feature ブランチ → プレビュー環境

---

## ✅ デプロイ後のチェックリスト

- [ ] トップページが開く
- [ ] Geminiチャットが動作する
- [ ] モデル選択が機能する
- [ ] エージェント一覧が表示される
- [ ] FAQボットが動作する
- [ ] エラーメッセージが適切に表示される
- [ ] レスポンスがストリーミングされる
- [ ] モバイル表示が正しい

---

## 📞 サポート

問題が発生した場合：

1. Vercelログを確認
2. ブラウザのコンソールを確認
3. 環境変数が正しく設定されているか確認
4. ローカル環境で動作するか確認

---

## 🎉 デプロイ成功！

おめでとうございます！アドネスAIエージェントがVercelで稼働しています。

**本番URL:** `https://your-app.vercel.app`

次のステップ:
- カスタムドメインの設定
- Analytics の確認
- パフォーマンスの監視

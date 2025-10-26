# 🚀 クイックスタートガイド

アドネスAIエージェントを5分で始める最短ガイド。

---

## ✅ 事前準備

以下のツールをインストール：
- Node.js 20以上
- npm または pnpm

---

## 📦 ステップ1: セットアップ

```bash
# 依存関係をインストール
npm install

# 環境変数ファイルをコピー
cp .env.example .env

# 環境変数を編集
nano .env  # または code .env
```

---

## 🔑 ステップ2: 必須APIキーを設定

`.env` ファイルを開いて、以下を設定：

```bash
# 必須
GEMINI_API_KEY=AIzaSy...（あなたのキー）
DIFY_API_KEY=app-...（あなたのキー）
```

**APIキーの取得方法:**
- Gemini: https://aistudio.google.com/app/apikey
- Dify: https://cloud.dify.ai/

---

## ✅ ステップ3: 環境変数チェック

```bash
npm run check-env
```

✅ が表示されればOK！

---

## 🏃 ステップ4: 起動

### Terminal 1: Mastraサーバー（必須）
```bash
npm run dev:mastra
```

### Terminal 2: Next.jsアプリ
```bash
npm run dev
```

---

## 🎉 ステップ5: アクセス

1. **通常のチャット**: http://localhost:3000/
2. **エージェント一覧**: http://localhost:3000/tools
3. **FAQボット**: エージェント一覧 → 「FAQ自動応答」をクリック

---

## 🧪 動作確認

```bash
# APIエンドポイントをテスト
npm run test-api
```

すべて ✅ が表示されればOK！

---

## 🚀 Vercelデプロイ

```bash
# 環境変数チェック
npm run check-env

# ビルドテスト
npm run build

# Vercelにデプロイ
vercel --prod
```

詳細は `VERCEL_DEPLOYMENT.md` を参照。

---

## 🐛 トラブルシューティング

### エラー: "API key not found"
→ `npm run check-env` を実行

### エラー: "Port already in use"
→ `lsof -i :3000` でプロセスを確認して kill

### エラー: "Module not found"
→ `npm install` を再実行

---

## 📚 さらに詳しく

- [Vercelデプロイガイド](./VERCEL_DEPLOYMENT.md)
- [エラー防止ガイド](./ERROR_PREVENTION.md)
- [CLAUDE.md](./CLAUDE.md) - 開発ガイド

---

## 🎯 よく使うコマンド

```bash
# 開発
npm run dev              # Next.jsアプリ起動
npm run dev:mastra       # Mastraサーバー起動

# ビルド
npm run build            # 本番ビルド
npm run check-env        # 環境変数チェック

# テスト
npm run test-api         # APIテスト
npm run type-check       # TypeScript型チェック
npm run lint             # コード品質チェック
```

---

## ✅ 完了！

おめでとうございます！アドネスAIエージェントが起動しました 🎉

次のステップ：
1. モデルを選択してチャットを試す
2. エージェント一覧を見てみる
3. FAQボットを試す

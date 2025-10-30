# 提案書自動生成機能 - クイックセットアップガイド

このガイドでは、提案書自動生成機能を使用するための環境変数設定方法を説明します。

## 📋 必要な情報

以下の情報が必要です：

- **APIキー**: `app-8fCbq5BGWkx76lTybaNrIrvx`
- **エンドポイント**: `https://api.dify.ai/v1`

## 🚀 セットアップ手順

### ステップ1: 環境変数ファイルを作成

プロジェクトのルートディレクトリ（`addnessAI-agent`）で以下のコマンドを実行します：

```bash
cd /Users/kurosakiyuto/Downloads/addnessAI-agent
touch .env.local
```

### ステップ2: 環境変数を追加

`.env.local`ファイルをテキストエディタで開き、以下の内容を追加します：

```bash
# Dify API Configuration (提案書自動生成機能)
DIFY_PROPOSAL_API_KEY=app-8fCbq5BGWkx76lTybaNrIrvx
DIFY_API_BASE_URL=https://api.dify.ai/v1
```

### ステップ3: 開発サーバーを起動（または再起動）

環境変数を追加した後は、開発サーバーを再起動する必要があります。

#### 既に起動している場合

1. ターミナルで `Ctrl + C` を押してサーバーを停止
2. 以下のコマンドで再起動：

```bash
npm run dev
```

#### まだ起動していない場合

```bash
npm run dev
```

### ステップ4: 提案書自動生成ページにアクセス

ブラウザで以下のURLにアクセスします：

```
http://localhost:3000/proposal
```

または、アプリケーションのサイドバーから「提案書自動生成」をクリックします。

## ✅ 動作確認

以下の手順で動作を確認できます：

1. 「役職」を選択（例：代表）
2. 「所属部署」を入力（例：営業部）
3. 「実際の課題感」を入力（例：業務の属人化が進んでいる）
4. 「提案書を生成」ボタンをクリック
5. AIが生成した提案書がリアルタイムで表示されることを確認

## 🔧 トラブルシューティング

### エラー: "提案書生成APIキーが設定されていません"

**原因**: `.env.local`ファイルに`DIFY_PROPOSAL_API_KEY`が設定されていません。

**解決方法**:
1. `.env.local`ファイルが存在することを確認
2. ファイル内に`DIFY_PROPOSAL_API_KEY=app-8fCbq5BGWkx76lTybaNrIrvx`が記載されていることを確認
3. 開発サーバーを再起動

### エラー: "Dify API request failed"

**原因**: DifyサービスへのAPI接続に失敗しています。

**解決方法**:
1. APIキーが正しいか確認（コピー&ペーストの際に余分なスペースが入っていないか）
2. インターネット接続を確認
3. Difyサービスのステータスを確認

### ページが見つからない

**原因**: サーバーが正しく起動していないか、URLが間違っています。

**解決方法**:
1. `npm run dev`でサーバーが起動していることを確認
2. URLが`http://localhost:3000/proposal`であることを確認
3. ターミナルでエラーメッセージがないか確認

## 📝 環境変数ファイルの場所

`.env.local`ファイルは以下の場所に配置されている必要があります：

```
/Users/kurosakiyuto/Downloads/addnessAI-agent/.env.local
```

## 🔒 セキュリティに関する注意

- `.env.local`ファイルは`.gitignore`に含まれているため、Gitにコミットされません
- APIキーは外部に漏らさないようにしてください
- 本番環境では環境変数を適切に管理してください

## 📚 詳細ドキュメント

より詳細な情報は以下のドキュメントを参照してください：

- [提案書自動生成機能の詳細](docs/PROPOSAL_GENERATION.md)
- [Dify公式ドキュメント](https://docs.dify.ai/)

## ❓ その他の質問

問題が解決しない場合は、GitHub Issuesで質問してください。


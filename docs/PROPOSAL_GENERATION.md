# 提案書自動生成機能

Difyワークフローを使用した提案書自動生成機能のドキュメントです。

## 概要

この機能は、ユーザーの役職、所属部署、課題感を入力することで、AIが最適な提案書を自動生成します。

## 設定方法

### 1. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加してください：

```bash
# 提案書自動生成 API設定
DIFY_PROPOSAL_API_KEY=app-8fCbq5BGWkx76lTybaNrIrvx
DIFY_API_BASE_URL=https://api.dify.ai/v1
```

### 2. 環境変数ファイルの作成

プロジェクトルートに`.env.local`ファイルがない場合は作成してください：

```bash
cd /Users/kurosakiyuto/Downloads/addnessAI-agent
touch .env.local
```

そして上記の環境変数を追加します。

## 使用方法

### Web UIから利用

1. ブラウザで http://localhost:3000/proposal にアクセス
2. 以下の情報を入力：
   - **役職**（必須）: 代表、管理職、役職なしから選択
   - **所属部署**（任意）: 営業部、IT部門など
   - **実際の課題感**（任意）: 具体的な課題を記載
3. 「提案書を生成」ボタンをクリック
4. AIが生成した提案書がリアルタイムで表示されます

### APIエンドポイントから利用

```bash
curl -X POST http://localhost:3000/api/proposal-generation \
  -H "Content-Type: application/json" \
  -d '{
    "yakusyoku": "代表",
    "busyo": "IT部門",
    "kadai": "業務の属人化が進んでおり、特定の担当者に依存している状況です。",
    "user": "user-123"
  }'
```

## Difyワークフローの構成

### 入力変数

- `yakusyoku`: 役職（代表、管理職、役職なし）
- `busyo`: 所属部署
- `kadai`: 実際の課題感

### ワークフロー

1. **開始ノード**: ユーザー入力を受け取る
2. **知識検索ノード**: ナレッジベースから関連情報を検索
   - データセットID: `hNRMc9p6ruNIox8JiCC37IWq41m0vppXgJGaklgDZ2Y86kjJfP0CncPpSOLi4zxQ`
   - 検索モード: ベクトル検索（vector_weight: 1）
   - top_k: 4
3. **LLMノード**: ChatGPT-4o-latestで提案書を生成
   - モデル: `chatgpt-4o-latest`
   - Temperature: 0.7
   - プロンプト: サービス内容を元に最適な提案書を生成
4. **回答ノード**: 生成された提案書を返却

## トラブルシューティング

### APIキーが見つからないエラー

```
Error: 提案書生成APIキーが設定されていません
```

**解決方法**: `.env.local`に`DIFY_PROPOSAL_API_KEY`を設定してください。

### Dify API接続エラー

```
Error: Dify API request failed
```

**確認事項**:
1. APIキーが正しいか確認
2. Difyサービスが稼働しているか確認
3. エンドポイント（`DIFY_API_BASE_URL`）が正しいか確認

### 開発サーバーの再起動

環境変数を追加した後は、開発サーバーを再起動してください：

```bash
npm run dev
```

## カスタマイズ

### 提案書生成のカスタマイズ

Difyワークフローでプロンプトやナレッジベースをカスタマイズできます：

1. Difyダッシュボードにログイン
2. 「提案書自動生成」ワークフローを開く
3. LLMノードのプロンプトを編集
4. ナレッジベースに追加情報を登録

### UIのカスタマイズ

`app/proposal/page.tsx`を編集してUIをカスタマイズできます。

## API仕様

### POST /api/proposal-generation

#### リクエストボディ

```json
{
  "yakusyoku": "代表",
  "busyo": "営業部",
  "kadai": "業務効率化が必要です",
  "conversationId": "optional-conversation-id",
  "user": "user-identifier"
}
```

#### レスポンス

ストリーミングレスポンス（Server-Sent Events形式）

```
data: {"event":"message","conversation_id":"...","message_id":"..."}
data: {"event":"agent_message","answer":"提案書の内容..."}
data: {"event":"message_end"}
```

## セキュリティ

- APIキーは`.env.local`で管理し、Gitにコミットしないでください
- `.env.local`は`.gitignore`に含まれています
- 機密情報をフォームに入力しないようユーザーに注意喚起してください

## 参考リンク

- [Dify公式ドキュメント](https://docs.dify.ai/)
- [Dify API Reference](https://docs.dify.ai/api-reference)


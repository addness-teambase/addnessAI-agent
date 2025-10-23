#!/bin/bash

# FAQ自動応答機能のプルリクエスト作成

echo "=========================================="
echo "📋 プルリクエスト情報"
echo "=========================================="
echo ""
echo "ブランチ: matumoto → main"
echo "コミット数: 2"
echo ""
echo "コミット:"
git log --oneline origin/matumoto..matumoto
echo ""
echo "=========================================="
echo "🔗 プルリクエスト作成URL:"
echo "=========================================="
echo ""
echo "https://github.com/addness-teambase/addnessAI-agent/compare/main...matumoto"
echo ""
echo "=========================================="
echo "📝 プルリクエスト内容（コピペ用）"
echo "=========================================="
echo ""
echo "【タイトル】"
echo "✨ FAQ自動応答機能の実装とUI改善"
echo ""
echo "【説明】"
cat << 'EOF'
## 概要
DifyAPIを統合したFAQ自動応答チャットボット機能を実装し、UIを改善しました。

## 主な変更内容

### 🤖 FAQ自動応答機能
- Dify API統合によるカスタムチャットUI実装
- リアルタイムストリーミング対応
- 会話履歴管理とリセット機能
- URLパラメータによるモード切り替え（`/?mode=faq-auto-response`）

### 🎨 UI改善
- エージェント一覧ページのレイアウト調整（右シフト）
- FAQ自動応答への動的ナビゲーション追加
- サイドバーの動的表示・非表示機能

### 🧹 サイドバーのクリーンアップ
- FAQ自動応答モード時のみ「FAQ自動応答」メニュー表示
- 不要なメニュー項目を削除（設定、ヘルプ、検索、メディア一覧、ドキュメント）

### 🔧 技術的な修正
- Node.js v24対応（`--hostname localhost`フラグ）
- Google Fontsエラーの修正（システムフォントに変更）

## 追加ファイル
- `app/api/dify-chat/route.ts` - Dify APIプロキシエンドポイント
- `app/hooks/useDifyChat.ts` - Difyチャット管理フック

## コミット（2件）
1. ✨ FAQ自動応答機能の実装と UI改善
2. 🔧 Node.js v24対応: --hostname localhostフラグを追加

## 必要な環境変数
```bash
DIFY_API_KEY=app-uyTWjRVJlh6NhZp1WYbJproQ
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_FAQ_APP_ID=your_app_id_here
```

## テスト済み ✅
- 開発サーバー起動（http://localhost:3001）
- FAQ自動応答チャット動作確認
- サイドバー動的表示・非表示
- Node.js v24での起動確認
EOF
echo ""
echo "=========================================="
echo "🚀 次のステップ"
echo "=========================================="
echo ""
echo "1. Cursor左側 → Source Control → 「Sync Changes」をクリック"
echo "2. 上記のURLをブラウザで開く"
echo "3. プルリクエスト内容をコピペ"
echo "4. 「Create pull request」をクリック"
echo ""



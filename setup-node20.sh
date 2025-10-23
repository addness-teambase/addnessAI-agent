#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Node.js v20 セットアップ開始"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: nvmを読み込む
echo "📦 Step 1: nvmを読み込んでいます..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Step 2: Node.js v20をインストール
echo "📥 Step 2: Node.js v20をインストールしています..."
nvm install 20

# Step 3: Node.js v20を使う
echo "🔄 Step 3: Node.js v20に切り替えています..."
nvm use 20

# Step 4: バージョン確認
echo "✅ Step 4: バージョン確認..."
node --version

# Step 5: プロジェクトディレクトリに移動
echo "📁 Step 5: プロジェクトディレクトリに移動..."
cd /Users/matsumotoshuntasuku/addnessAI-agent

# Step 6: 古いサーバーを停止
echo "🛑 Step 6: 古いサーバーを停止しています..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:4111 | xargs kill -9 2>/dev/null

# Step 7: node_modulesを削除して再インストール
echo "🗑️  Step 7: 古い依存関係を削除しています..."
rm -rf node_modules package-lock.json

echo "📦 Step 8: 依存関係を再インストールしています（数分かかります）..."
npm install

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ セットアップ完了！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "次のステップ："
echo ""
echo "【ターミナル1（このターミナル）】"
echo "  npm run dev:mastra"
echo ""
echo "【ターミナル2（新しいターミナルを開いて）】"
echo "  cd /Users/matsumotoshuntasuku/addnessAI-agent"
echo "  export NVM_DIR=\"\$HOME/.nvm\""
echo "  [ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\""
echo "  nvm use 20"
echo "  npm run dev"
echo ""
echo "その後、ブラウザで http://localhost:3000 を開いてください！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


#!/bin/bash

# 提案書自動生成機能のセットアップスクリプト
# このスクリプトは.env.localファイルに必要な環境変数を追加します

set -e

# カラー出力用
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  提案書自動生成機能 セットアップ${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# プロジェクトのルートディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$SCRIPT_DIR/.env.local"

# .env.localファイルの存在確認
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  .env.localファイルが見つかりません。新規作成します。${NC}"
    touch "$ENV_FILE"
    echo -e "${GREEN}✓ .env.localファイルを作成しました${NC}"
else
    echo -e "${GREEN}✓ .env.localファイルが見つかりました${NC}"
fi

# 既に設定されているか確認
if grep -q "DIFY_PROPOSAL_API_KEY" "$ENV_FILE"; then
    echo -e "${YELLOW}⚠️  DIFY_PROPOSAL_API_KEYは既に設定されています${NC}"
    echo ""
    echo "現在の設定:"
    grep "DIFY_PROPOSAL_API_KEY" "$ENV_FILE" || true
    echo ""
    read -p "上書きしますか？ (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}セットアップをキャンセルしました${NC}"
        exit 0
    fi
    
    # 既存の設定を削除
    sed -i.bak '/DIFY_PROPOSAL_API_KEY/d' "$ENV_FILE"
    sed -i.bak '/DIFY_API_BASE_URL/d' "$ENV_FILE"
    rm -f "${ENV_FILE}.bak"
fi

# 環境変数を追加
echo "" >> "$ENV_FILE"
echo "# Dify API Configuration (提案書自動生成機能)" >> "$ENV_FILE"
echo "DIFY_PROPOSAL_API_KEY=app-8fCbq5BGWkx76lTybaNrIrvx" >> "$ENV_FILE"
echo "DIFY_API_BASE_URL=https://api.dify.ai/v1" >> "$ENV_FILE"

echo -e "${GREEN}✓ 環境変数を追加しました${NC}"
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  セットアップが完了しました！${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "次のステップ:"
echo ""
echo "1. 開発サーバーを起動（または再起動）します："
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. ブラウザで以下のURLにアクセスします："
echo -e "   ${YELLOW}http://localhost:3000/proposal${NC}"
echo ""
echo "詳細は PROPOSAL_SETUP.md を参照してください。"
echo ""


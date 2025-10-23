#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 APIキー設定ツール"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "このツールでAPIキーを簡単に設定できます。"
echo "（Enter だけ押せばスキップできます）"
echo ""

# Google Gemini API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌟 Google Gemini API"
echo "取得先: https://aistudio.google.com/app/apikey"
echo ""
read -p "Gemini APIキーを入力: " GEMINI_KEY

if [[ -n "$GEMINI_KEY" ]]; then
    # .envファイルを更新
    sed -i.bak "s|GOOGLE_GENERATIVE_AI_API_KEY=.*|GOOGLE_GENERATIVE_AI_API_KEY=$GEMINI_KEY|g" .env
    sed -i.bak "s|GEMINI_API_KEY=.*|GEMINI_API_KEY=$GEMINI_KEY|g" .env
    echo "✅ Gemini API設定完了"
else
    echo "⏭️  スキップしました"
fi

echo ""

# Brave Search API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Brave Search API"
echo "取得先: https://api.search.brave.com/app/keys"
echo ""
read -p "Brave APIキーを入力: " BRAVE_KEY

if [[ -n "$BRAVE_KEY" ]]; then
    sed -i.bak "s|BRAVE_API_KEY=.*|BRAVE_API_KEY=$BRAVE_KEY|g" .env
    echo "✅ Brave API設定完了"
else
    echo "⏭️  スキップしました"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 設定完了！"
echo ""
echo "設定を確認するには: ./check-env.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# バックアップファイルを削除
rm -f .env.bak

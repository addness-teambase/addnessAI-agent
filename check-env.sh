#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 API設定チェック"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# .envファイルの存在確認
if [ ! -f .env ]; then
    echo "❌ .envファイルが見つかりません"
    exit 1
fi

# .envファイルを読み込む
source .env

echo "【必須API】"
echo ""

# Gemini API
if [[ "$GEMINI_API_KEY" != "your_google_ai_api_key_here" ]] && [[ -n "$GEMINI_API_KEY" ]]; then
    echo "✅ Google Gemini API: 設定済み (${GEMINI_API_KEY:0:10}...)"
else
    echo "❌ Google Gemini API: 未設定"
fi

# Brave API
if [[ "$BRAVE_API_KEY" != "your_brave_api_key_here" ]] && [[ -n "$BRAVE_API_KEY" ]]; then
    echo "✅ Brave Search API: 設定済み (${BRAVE_API_KEY:0:10}...)"
else
    echo "❌ Brave Search API: 未設定"
fi

echo ""
echo "【オプションAI API】"
echo ""

# Claude API
if [[ "$ANTHROPIC_API_KEY" != "your_anthropic_api_key_here" ]] && [[ -n "$ANTHROPIC_API_KEY" ]]; then
    echo "✅ Anthropic Claude API: 設定済み"
else
    echo "⚪ Anthropic Claude API: 未設定 (オプション)"
fi

# OpenAI API
if [[ "$OPENAI_API_KEY" != "your_openai_api_key_here" ]] && [[ -n "$OPENAI_API_KEY" ]]; then
    echo "✅ OpenAI GPT API: 設定済み"
else
    echo "⚪ OpenAI GPT API: 未設定 (オプション)"
fi

# X.AI API
if [[ "$XAI_API_KEY" != "your_xai_api_key_here" ]] && [[ -n "$XAI_API_KEY" ]]; then
    echo "✅ X.AI Grok API: 設定済み"
else
    echo "⚪ X.AI Grok API: 未設定 (オプション)"
fi

echo ""
echo "【メディア生成API】"
echo ""

# Fal.ai
if [[ "$FAL_KEY" != "your_fal_key_here" ]] && [[ -n "$FAL_KEY" ]]; then
    echo "✅ Fal.ai API: 設定済み"
else
    echo "⚪ Fal.ai API: 未設定 (オプション)"
fi

# MiniMax
if [[ "$MINIMAX_API_KEY" != "your_minimax_api_key_here" ]] && [[ -n "$MINIMAX_API_KEY" ]]; then
    echo "✅ MiniMax API: 設定済み"
else
    echo "⚪ MiniMax API: 未設定 (オプション)"
fi

echo ""
echo "【ブラウザ自動化API】"
echo ""

# Browserbase
if [[ "$BROWSERBASE_API_KEY" != "your_browserbase_api_key_here" ]] && [[ -n "$BROWSERBASE_API_KEY" ]]; then
    echo "✅ Browserbase API: 設定済み"
else
    echo "⚪ Browserbase API: 未設定 (オプション)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 必須APIが設定されているか確認
if [[ "$GEMINI_API_KEY" != "your_google_ai_api_key_here" ]] && [[ -n "$GEMINI_API_KEY" ]] && \
   [[ "$BRAVE_API_KEY" != "your_brave_api_key_here" ]] && [[ -n "$BRAVE_API_KEY" ]]; then
    echo "🎉 必須APIが設定されています！"
    echo "   npm run dev で起動できます。"
else
    echo "⚠️  必須APIが未設定です。"
    echo "   Gemini API と Brave Search API を設定してください。"
fi

echo ""

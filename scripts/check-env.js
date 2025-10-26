#!/usr/bin/env node

/**
 * 環境変数チェックスクリプト
 *
 * 使い方:
 *   npm run check-env
 *
 * ビルド前に自動実行:
 *   package.json に "prebuild": "node scripts/check-env.js" を追加
 */

const fs = require('fs');
const path = require('path');

// 環境変数の設定
const envConfig = [
  {
    key: 'GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini API Key',
    validate: (v) => v.startsWith('AIza') && v.length === 39,
  },
  {
    key: 'GOOGLE_GENERATIVE_AI_API_KEY',
    required: false,
    description: 'Google Gemini API Key (alternative)',
    validate: (v) => v.startsWith('AIza') && v.length === 39,
  },
  {
    key: 'DIFY_API_KEY',
    required: true,
    description: 'Dify API Key for FAQ Bot',
    validate: (v) => v.startsWith('app-'),
  },
  {
    key: 'DIFY_API_BASE_URL',
    required: false,
    description: 'Dify API Base URL',
  },
  {
    key: 'ANTHROPIC_API_KEY',
    required: false,
    description: 'Anthropic Claude API Key (Optional)',
  },
  {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API Key (Optional)',
  },
  {
    key: 'XAI_API_KEY',
    required: false,
    description: 'X.AI Grok API Key (Optional)',
  },
];

function checkEnv() {
  let hasError = false;
  let hasWarning = false;

  console.log('🔍 環境変数チェック開始...\n');

  // .env ファイルの存在確認
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env ファイルが見つかりません');
    console.error('   .env.example をコピーして .env を作成してください\n');
    process.exit(1);
  }

  envConfig.forEach(({ key, required, description, validate }) => {
    const value = process.env[key];

    if (!value) {
      if (required) {
        console.error(`❌ ${key} が設定されていません (必須)`);
        console.error(`   説明: ${description}\n`);
        hasError = true;
      } else {
        console.warn(`⚠️  ${key} が設定されていません (オプション)`);
        console.warn(`   説明: ${description}\n`);
        hasWarning = true;
      }
      return;
    }

    // プレースホルダーチェック
    if (value.includes('your_') || value.includes('placeholder') || value.includes('here')) {
      if (required) {
        console.error(`❌ ${key} がプレースホルダーのままです (必須)`);
        console.error(`   現在の値: ${value.substring(0, 30)}...`);
        console.error(`   説明: ${description}\n`);
        hasError = true;
      } else {
        console.warn(`⚠️  ${key} がプレースホルダーのままです (オプション)`);
        console.warn(`   説明: ${description}\n`);
        hasWarning = true;
      }
      return;
    }

    // カスタムバリデーション
    if (validate && !validate(value)) {
      console.error(`❌ ${key} のフォーマットが不正です`);
      console.error(`   説明: ${description}\n`);
      hasError = true;
      return;
    }

    console.log(`✅ ${key} - OK`);
  });

  console.log('');

  if (hasError) {
    console.error('❌ 環境変数に問題があります。.env ファイルを確認してください。');
    console.error('   詳細は ERROR_PREVENTION.md を参照してください。\n');
    process.exit(1);
  }

  if (hasWarning) {
    console.warn('⚠️  一部のオプション環境変数が設定されていません。');
    console.warn('   必要に応じて .env ファイルに追加してください。\n');
  }

  console.log('✅ 必須の環境変数がすべて正しく設定されています！\n');
  process.exit(0);
}

// .env ファイルを読み込む（dotenvがない場合）
try {
  require('dotenv').config();
} catch (e) {
  // dotenvがインストールされていない場合は手動で読み込む
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#][^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  }
}

checkEnv();

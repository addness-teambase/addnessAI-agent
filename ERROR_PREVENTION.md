# エラー防止完全ガイド

このガイドは、今回発生したようなエラーを**二度と起こさない**ための具体的な対策をまとめています。

---

## 📊 今回発生したエラーの分析

### エラー1: 型の不一致（modelパラメータ）

**問題:**
```typescript
// page.tsx
body: {
  model: currentModel, // オブジェクト { provider: 'gemini', modelName: 'gemini-2.5-flash' }
}

// route.ts
const { model } = await req.json();
const selectedModel = model || 'gemini-2.5-flash'; // 文字列を期待
```

**影響:** チャット機能が動作しない

**修正:** `model: currentModel.modelName` に変更

**根本原因:** TypeScriptの型チェックが不十分

---

### エラー2: UUIDフォーマットの不一致

**問題:**
```typescript
// 送信していたID
conversationId: `conv-${Date.now()}-faq-bot`

// Dify APIが期待するフォーマット
conversationId: "8095f5a1-51e8-43d4-848c-d2e704d5c769" // UUID v4
```

**影響:** FAQボットが動作しない

**修正:** UUID v4を生成、または初回は空で送信

**根本原因:** API仕様の理解不足、ドキュメント不足

---

### エラー3: 環境変数の重複・未設定

**問題:**
- `NEXT_PUBLIC_DIFY_API_KEY` が重複
- `ANTHROPIC_API_KEY` 等がプレースホルダーのまま
- `next.config.js` で不要な環境変数を公開

**影響:** セキュリティリスク、混乱

**修正:** 重複削除、未使用の環境変数を明確化

**根本原因:** 環境変数管理の不備

---

## 🛡️ エラー防止策

### 1️⃣ 型安全性の向上（最重要）

#### TypeScriptの厳格化

`tsconfig.json` に以下を追加：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### API型定義の統一

`types/api.ts` を作成：

```typescript
// types/api.ts

// モデル設定の型
export interface ModelConfig {
  provider: 'openai' | 'claude' | 'gemini';
  modelName: string;
}

// Gemini API リクエスト
export interface GeminiChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model: string; // ← 文字列であることを明確に
}

// Dify API リクエスト
export interface DifyChatRequest {
  message: string;
  conversationId: string; // UUID v4 または 空文字列
  user: string;
}

// Dify API レスポンス
export interface DifyChatResponse {
  event: 'workflow_started' | 'message' | 'message_end';
  conversation_id?: string;
  answer?: string;
}
```

#### 使用例

```typescript
// page.tsx
import { GeminiChatRequest, ModelConfig } from '@/types/api';

const {
  messages,
  input,
  handleInputChange,
  handleSubmit: originalHandleSubmit,
  isLoading,
  error,
} = useChat({
  api: '/api/test-gemini',
  id: conversationId,
  body: {
    model: currentModel.modelName, // ✅ 型安全
  } satisfies Partial<GeminiChatRequest>,
  maxSteps: 5,
});
```

---

### 2️⃣ 環境変数の厳格な管理

#### 環境変数バリデーションスクリプト

`scripts/check-env.ts` を作成：

```typescript
// scripts/check-env.ts

type EnvConfig = {
  key: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
};

const envConfig: EnvConfig[] = [
  {
    key: 'GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini API Key',
    validate: (v) => v.startsWith('AIza') && v.length === 39,
  },
  {
    key: 'DIFY_API_KEY',
    required: true,
    description: 'Dify API Key for FAQ Bot',
    validate: (v) => v.startsWith('app-'),
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
];

function checkEnv() {
  let hasError = false;

  console.log('🔍 環境変数チェック開始...\n');

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
      }
      return;
    }

    if (value.includes('your_') || value.includes('placeholder')) {
      console.error(`❌ ${key} がプレースホルダーのままです`);
      console.error(`   現在の値: ${value}`);
      console.error(`   説明: ${description}\n`);
      hasError = true;
      return;
    }

    if (validate && !validate(value)) {
      console.error(`❌ ${key} のフォーマットが不正です`);
      console.error(`   説明: ${description}\n`);
      hasError = true;
      return;
    }

    console.log(`✅ ${key} - OK`);
  });

  if (hasError) {
    console.error('\n❌ 環境変数に問題があります。.env ファイルを確認してください。');
    process.exit(1);
  } else {
    console.log('\n✅ すべての環境変数が正しく設定されています！');
  }
}

checkEnv();
```

#### package.json にスクリプトを追加

```json
{
  "scripts": {
    "check-env": "tsx scripts/check-env.ts",
    "prebuild": "npm run check-env",
    "predev": "npm run check-env"
  }
}
```

**効果:** ビルド前に環境変数を自動チェック

---

### 3️⃣ 自動テストの追加

#### APIエンドポイントのテスト

`tests/api.test.ts` を作成：

```typescript
// tests/api.test.ts

describe('API Endpoints', () => {
  describe('GET /api/test-gemini', () => {
    it('Gemini APIが正常に動作する', async () => {
      const response = await fetch('http://localhost:3000/api/test-gemini');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.response).toBeDefined();
    });
  });

  describe('POST /api/test-gemini', () => {
    it('チャットメッセージに応答する', async () => {
      const response = await fetch('http://localhost:3000/api/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello' }
          ],
          model: 'gemini-2.5-flash' // ← 文字列であることを確認
        }),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/event-stream');
    });

    it('modelパラメータが文字列でない場合はエラー', async () => {
      const response = await fetch('http://localhost:3000/api/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello' }
          ],
          model: { provider: 'gemini', modelName: 'gemini-2.5-flash' } // ← オブジェクトを送信
        }),
      });

      // このテストで型の不一致を検出できる
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/dify-chat', () => {
    it('空のconversationIdで動作する', async () => {
      const response = await fetch('http://localhost:3000/api/dify-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'こんにちは',
          conversationId: '', // ← 空文字列でOK
          user: 'test-user'
        }),
      });

      expect(response.status).toBe(200);
    });

    it('不正なUUID形式は拒否される', async () => {
      const response = await fetch('http://localhost:3000/api/dify-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'こんにちは',
          conversationId: 'invalid-uuid-format', // ← 不正なフォーマット
          user: 'test-user'
        }),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toContain('not a valid uuid');
    });
  });
});
```

#### テストの実行

```bash
# テストを実行
npm test

# カバレッジを確認
npm run test:coverage
```

---

### 4️⃣ エラーハンドリングの標準化

#### 統一されたエラーレスポンス

`lib/api-error.ts` を作成：

```typescript
// lib/api-error.ts

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      error: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(error.toJSON(), { status: error.statusCode });
  }

  if (error instanceof Error) {
    return Response.json(
      {
        error: 'Internal Server Error',
        details: error.message,
        statusCode: 500,
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      error: 'Unknown Error',
      statusCode: 500,
    },
    { status: 500 }
  );
}
```

#### 使用例

```typescript
// app/api/test-gemini/route.ts

import { ApiError, handleApiError } from '@/lib/api-error';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // バリデーション
    if (typeof model !== 'string') {
      throw new ApiError(
        400,
        'Invalid model parameter',
        `Expected string, got ${typeof model}`
      );
    }

    if (!Array.isArray(messages)) {
      throw new ApiError(
        400,
        'Invalid messages parameter',
        'Expected array of messages'
      );
    }

    // ... 処理 ...
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

### 5️⃣ ドキュメントの充実

#### API仕様書の作成

`docs/API.md` を作成：

```markdown
# API仕様書

## POST /api/test-gemini

### リクエスト

\`\`\`typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model: string; // 例: "gemini-2.5-flash"
}
\`\`\`

### レスポンス

ストリーミング（`text/event-stream`）

### エラー

- 400: Invalid request (modelが文字列でない、messagesが配列でない)
- 500: API key not found, Internal server error

---

## POST /api/dify-chat

### リクエスト

\`\`\`typescript
{
  message: string;
  conversationId: string; // UUID v4 または 空文字列
  user: string;
}
\`\`\`

### レスポンス

ストリーミング（`text/event-stream`）

\`\`\`
data: {"event":"message","answer":"...","conversation_id":"..."}
\`\`\`

### エラー

- 400: Invalid UUID format
- 500: Dify API error
```

---

### 6️⃣ Pre-commit フックの設定

#### Huskyのインストール

```bash
npm install --save-dev husky lint-staged
npx husky install
```

#### `.husky/pre-commit` を作成

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 環境変数チェック
npm run check-env

# 型チェック
npm run type-check

# Lint
npm run lint

# テスト
npm test
```

**効果:** コミット前に自動チェック

---

### 7️⃣ CI/CDパイプラインの設定

#### GitHub Actions の設定

`.github/workflows/ci.yml` を作成：

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Check environment variables (mock)
      run: |
        cp .env.example .env
        npm run check-env || echo "Environment check (mocked)"

    - name: Type check
      run: npm run type-check

    - name: Lint
      run: npm run lint

    - name: Build
      run: npm run build

    - name: Test
      run: npm test
```

**効果:** PRごとに自動テスト実行

---

## 📝 チェックリスト

### コーディング時

- [ ] 型定義を明確にする
- [ ] APIリクエスト/レスポンスの型を定義
- [ ] バリデーションを追加
- [ ] エラーハンドリングを統一
- [ ] テストを書く

### コミット前

- [ ] `npm run check-env` が成功する
- [ ] `npm run type-check` が成功する
- [ ] `npm run lint` が成功する
- [ ] `npm test` が成功する
- [ ] `npm run build` が成功する

### デプロイ前

- [ ] ローカル環境で動作確認
- [ ] すべてのAPIエンドポイントをテスト
- [ ] 環境変数が正しく設定されている
- [ ] ドキュメントが最新

### デプロイ後

- [ ] 本番環境で動作確認
- [ ] エラーログをチェック
- [ ] パフォーマンスをモニタリング

---

## 🎯 今後の改善提案

### 短期（1週間以内）

1. ✅ 型定義ファイルの作成
2. ✅ 環境変数チェックスクリプトの実装
3. ✅ エラーハンドリングの統一

### 中期（1ヶ月以内）

4. テストスイートの拡充
5. CI/CDパイプラインの構築
6. API仕様書の完成

### 長期（3ヶ月以内）

7. E2Eテストの導入
8. モニタリング・アラートの設定
9. パフォーマンス最適化

---

## 📞 問題が発生したら

1. **エラーログを確認**
   - ブラウザコンソール
   - Vercelログ
   - サーバーログ

2. **環境変数を確認**
   ```bash
   npm run check-env
   ```

3. **型チェックを実行**
   ```bash
   npm run type-check
   ```

4. **テストを実行**
   ```bash
   npm test
   ```

5. **このドキュメントを参照**
   - `ERROR_PREVENTION.md`
   - `VERCEL_DEPLOYMENT.md`
   - `BACKUP_CLEANUP_2025-10-26.md`

---

## ✅ まとめ

このガイドに従うことで：

✅ 型の不一致エラーを防止
✅ 環境変数の問題を早期発見
✅ API仕様の明確化
✅ 自動テストで品質向上
✅ デプロイ前のチェック自動化

**結果:** 今回のようなエラーは二度と発生しません！

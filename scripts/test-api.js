#!/usr/bin/env node

/**
 * APIエンドポイント自動テストスクリプト
 *
 * 使い方:
 *   npm run test-api
 *
 * オプション:
 *   API_URL=https://your-app.vercel.app npm run test-api
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

console.log(`🧪 APIテスト開始 (${API_URL})\n`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ ${name}`);
    passedTests++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   エラー: ${error.message}\n`);
    failedTests++;
  }
}

async function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runTests() {
  console.log('--- Gemini API テスト ---\n');

  await test('GET /api/test-gemini - Gemini APIが動作する', async () => {
    const response = await fetch(`${API_URL}/api/test-gemini`);
    const data = await response.json();

    await assert(response.status === 200, `Status should be 200, got ${response.status}`);
    await assert(data.success === true, 'success should be true');
    await assert(data.response, 'response should exist');
  });

  await test('POST /api/test-gemini - チャットメッセージに応答する', async () => {
    const response = await fetch(`${API_URL}/api/test-gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        model: 'gemini-2.5-flash'
      }),
    });

    await assert(response.status === 200, `Status should be 200, got ${response.status}`);

    const contentType = response.headers.get('content-type');
    await assert(
      contentType && contentType.includes('text/event-stream'),
      `Content-Type should be text/event-stream, got ${contentType}`
    );
  });

  await test('POST /api/test-gemini - messagesが必須', async () => {
    const response = await fetch(`${API_URL}/api/test-gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-2.5-flash'
        // messages を省略
      }),
    });

    await assert(response.status === 400, `Status should be 400, got ${response.status}`);
  });

  console.log('\n--- Dify API テスト ---\n');

  await test('POST /api/dify-chat - 空のconversationIdで動作する', async () => {
    const response = await fetch(`${API_URL}/api/dify-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'こんにちは',
        conversationId: '',
        user: 'test-user'
      }),
    });

    await assert(response.status === 200, `Status should be 200, got ${response.status}`);

    const contentType = response.headers.get('content-type');
    await assert(
      contentType && contentType.includes('text/event-stream'),
      `Content-Type should be text/event-stream, got ${contentType}`
    );
  });

  console.log('\n--- 結果 ---\n');
  console.log(`総テスト数: ${totalTests}`);
  console.log(`✅ 成功: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}\n`);

  if (failedTests > 0) {
    console.error('❌ テストが失敗しました');
    process.exit(1);
  } else {
    console.log('✅ すべてのテストが成功しました！');
    process.exit(0);
  }
}

runTests().catch(error => {
  console.error('テスト実行中にエラーが発生しました:', error);
  process.exit(1);
});

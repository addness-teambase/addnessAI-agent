import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Dify Chat Completion API
 * FAQ自動応答チャットボット用のエンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, user } = await request.json();

    // 環境変数の検証
    const apiKey = process.env.DIFY_API_KEY;
    const baseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Dify API key is not configured' },
        { status: 500 }
      );
    }

    console.log('[Dify Chat] Request:', { message, conversationId, user });

    // Dify API呼び出し
    const difyResponse = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'streaming',
        conversation_id: conversationId || '',
        user: user || 'default-user',
        files: [],
      }),
    });

    if (!difyResponse.ok) {
      const errorData = await difyResponse.text();
      console.error('[Dify Chat] API Error:', errorData);
      return NextResponse.json(
        { error: 'Dify API request failed', details: errorData },
        { status: difyResponse.status }
      );
    }

    // ストリーミングレスポンスを返す
    return new NextResponse(difyResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Dify Chat] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


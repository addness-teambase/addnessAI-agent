import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 提案書自動生成 API
 * Difyワークフローを使用して、ユーザーの課題から提案書を自動生成
 */
export async function POST(request: NextRequest) {
  try {
    const { yakusyoku, busyo, kadai, conversationId, user } = await request.json();

    // バリデーション
    if (!yakusyoku) {
      return NextResponse.json(
        { error: '役職は必須です' },
        { status: 400 }
      );
    }

    // APIキーとエンドポイント（直接指定）
    const apiKey = 'app-8fCbq5BGWkx76lTybaNrIrvx';
    const baseUrl = 'https://api.dify.ai/v1';

    console.log('[Proposal Generation] Request:', {
      yakusyoku,
      busyo: busyo || '未設定',
      kadaiLength: kadai?.length || 0,
      conversationId,
      user,
    });

    // Difyワークフローの入力変数
    const inputs: Record<string, any> = {
      yakusyoku: yakusyoku,
      busyo: busyo || '',
      kadai: kadai || '',
    };

    // クエリ文字列を構築（ナレッジ検索用）
    const query = `役職: ${yakusyoku}\n所属部署: ${busyo || '未設定'}\n課題: ${kadai || '未設定'}`;

    const requestBody = {
      inputs: inputs,
      query: query,
      response_mode: 'streaming',
      ...(conversationId && conversationId.length > 0 ? { conversation_id: conversationId } : {}),
      user: user || 'default-user',
    };

    console.log('[Proposal Generation] Request body:', JSON.stringify(requestBody, null, 2));

    // Dify API呼び出し
    const difyResponse = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!difyResponse.ok) {
      const errorData = await difyResponse.text();
      console.error('[Proposal Generation] API Error:', {
        status: difyResponse.status,
        statusText: difyResponse.statusText,
        body: errorData,
      });

      let errorDetails = errorData;
      try {
        const parsed = JSON.parse(errorData);
        errorDetails = JSON.stringify(parsed);
        console.error('[Proposal Generation] Parsed error:', parsed);
      } catch (e) {
        console.error('[Proposal Generation] Could not parse error response');
      }

      return NextResponse.json(
        {
          error: 'Dify API request failed',
          details: errorDetails,
          status: difyResponse.status,
        },
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
    console.error('[Proposal Generation] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Dify Chat Completion API
 * 複数のDifyエージェント（FAQ自動応答、契約書レビューなど）用のエンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, user, mode, files } = await request.json();

    // バリデーション：メッセージまたはファイルが必要
    if (!message && (!files || files.length === 0)) {
      console.error('[Dify Chat] Validation error: No message or files');
      return NextResponse.json(
        { error: 'Message or files are required' },
        { status: 400 }
      );
    }

    // モードに応じてAPIキーを選択
    const apiKeyMap: Record<string, string | undefined> = {
      'faq-auto-response': process.env.DIFY_FAQ_API_KEY,
      'contract-review': process.env.DIFY_CONTRACT_REVIEW_API_KEY,
    };

    // 後方互換性のため、DIFY_API_KEYもチェック
    const apiKey = apiKeyMap[mode as string] || process.env.DIFY_API_KEY;
    const baseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

    if (!apiKey) {
      console.error('[Dify Chat] API key not found for mode:', mode);
      return NextResponse.json(
        { error: `Dify API key is not configured for mode: ${mode}` },
        { status: 500 }
      );
    }

    console.log('[Dify Chat] Request:', {
      messageLength: message?.length,
      conversationId,
      user,
      mode,
      filesCount: files?.length || 0,
    });

    // inputsにdocsを含める（Difyワークフローの入力変数）
    const inputs: Record<string, any> = {};

    // ファイルがある場合、inputsにdocsとして追加
    if (files && files.length > 0) {
      inputs.docs = files;
    }

    const requestBody = {
      inputs: inputs, // docsを含むinputs
      query: message,
      response_mode: 'streaming',
      // 最初のメッセージでは conversation_id を含めない
      ...(conversationId && conversationId.length > 0 ? { conversation_id: conversationId } : {}),
      user: user || 'default-user',
      files: files || [], // アップロード済みファイルのID配列（後方互換性のため）
    };

    console.log('[Dify Chat] Request body:', JSON.stringify(requestBody, null, 2));
    console.log('[Dify Chat] Sending to Dify:', {
      url: `${baseUrl}/chat-messages`,
      queryLength: requestBody.query?.length,
      filesCount: requestBody.files?.length,
      inputsDocs: inputs.docs,
    });

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
      console.error('[Dify Chat] API Error:', {
        status: difyResponse.status,
        statusText: difyResponse.statusText,
        body: errorData,
        requestBody: requestBody,
      });

      // エラーの詳細をパース
      let errorDetails = errorData;
      try {
        const parsed = JSON.parse(errorData);
        errorDetails = JSON.stringify(parsed);
        console.error('[Dify Chat] Parsed error:', parsed);
      } catch (e) {
        console.error('[Dify Chat] Could not parse error response');
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
    console.error('[Dify Chat] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}



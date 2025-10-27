import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

export async function GET() {
  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Say hello in Japanese',
    });

    return Response.json({
      success: true,
      response: result.text,
      message: 'Gemini API is working correctly'
    });
  } catch (error) {
    console.error('Gemini API test error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Gemini API test failed'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    // デフォルトモデルはgemini-2.5-flash
    const selectedModel = model || 'gemini-2.5-flash';

    console.log('[Chat API] Request:', {
      messageCount: messages?.length,
      model: selectedModel
    });

    // API キーの確認
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('[Chat API] API key not found');
      return Response.json(
        {
          error: 'GEMINI_API_KEY または GOOGLE_GENERATIVE_AI_API_KEY が設定されていません',
          details: '環境変数を確認してください'
        },
        { status: 500 }
      );
    }

    // メッセージの検証
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        {
          error: '無効なリクエスト',
          details: 'messagesが必要です'
        },
        { status: 400 }
      );
    }

    console.log('[Chat API] Starting streaming response with model:', selectedModel);

    // ストリーミングレスポンス
    const result = streamText({
      model: google(selectedModel),
      system: `You are a helpful and honest AI assistant. Follow these guidelines:

1. If you don't know the answer or cannot find information about something, clearly state: "申し訳ございませんが、その情報は検索しても見つかりませんでした" or "その情報については確実なことがわかりません"

2. Never make up or guess information. Only provide answers based on your training data or verified knowledge.

3. If information is uncertain or outdated, mention that explicitly.

4. Be transparent about the limitations of your knowledge.

5. If a question requires real-time data or recent events beyond your training cutoff, inform the user that you cannot access that information.`,
      messages,
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[Chat API] Error:', error);

    // エラーの詳細をログに出力
    if (error instanceof Error) {
      console.error('[Chat API] Error message:', error.message);
      console.error('[Chat API] Error stack:', error.stack);
    }

    return Response.json(
      {
        error: 'チャットAPIでエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'APIキーまたはネットワーク接続を確認してください。'
      },
      { status: 500 }
    );
  }
}
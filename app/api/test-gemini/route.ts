import { google } from '@ai-sdk/google';
import { generateText, streamText, convertToCoreMessages } from 'ai';

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
    const { messages, model, mode } = await req.json();

    // デフォルトモデルはgemini-2.5-flash
    const selectedModel = model || 'gemini-2.5-flash';

    console.log('[Chat API] Request:', {
      messageCount: messages?.length,
      model: selectedModel,
      mode: mode,
      hasAttachments: messages?.some((m: any) => m.experimental_attachments || m.attachments)
    });

    // attachments情報をログ出力（デバッグ用）
    if (messages && Array.isArray(messages)) {
      messages.forEach((msg: any, idx: number) => {
        if (msg.experimental_attachments || msg.attachments) {
          const attachments = msg.experimental_attachments || msg.attachments;
          console.log(`[Chat API] Message ${idx} attachments:`, {
            count: attachments?.length,
            types: attachments?.map((a: any) => a.contentType || a.type)
          });
        }
      });
    }

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

    // メッセージをCore形式に変換（ファイル添付を含む）
    const coreMessages = convertToCoreMessages(messages);

    console.log('[Chat API] Core messages:', JSON.stringify(coreMessages, null, 2));

    // モードに応じたシステムプロンプトを設定
    let systemPrompt = `You are a helpful and honest AI assistant. Follow these guidelines:

1. If you don't know the answer or cannot find information about something, clearly state: "申し訳ございませんが、その情報は検索しても見つかりませんでした" or "その情報については確実なことがわかりません"

2. Never make up or guess information. Only provide answers based on your training data or verified knowledge.

3. If information is uncertain or outdated, mention that explicitly.

4. Be transparent about the limitations of your knowledge.

5. If a question requires real-time data or recent events beyond your training cutoff, inform the user that you cannot access that information.

6. When analyzing files (PDFs, documents, images), provide detailed and accurate information based on the content.`;

    // 契約書レビューモードの場合、専用のシステムプロンプトを使用
    if (mode === 'contract-review') {
      systemPrompt = `You are a professional contract review specialist AI assistant with expertise in legal documents. Your role is to:

1. **契約書の分析**: 契約書の内容を詳細に分析し、主要な条項、義務、権利を明確に説明する

2. **リスクの特定**: 潜在的なリスク、不利な条項、曖昧な表現を特定し、わかりやすく指摘する

3. **重要ポイントの抽出**:
   - 契約期間と更新条件
   - 支払い条件と金額
   - 解約条件とペナルティ
   - 責任範囲と免責事項
   - 知的財産権の取り扱い
   - 機密保持条項
   - 紛争解決方法

4. **改善提案**: より公平または有利な条件にするための具体的な提案を行う

5. **専門用語の解説**: 法律用語や専門用語をわかりやすく解説する

6. **チェックリスト**: レビュー後に確認すべき重要事項のチェックリストを提供する

**注意事項**:
- 法的助言ではなく、情報提供として回答する
- 不明な点や判断が難しい箇所は、専門家への相談を推奨する
- 契約書の全文が提供されない場合は、その旨を明記する

ファイルが添付された場合は、その内容を詳細に分析して上記の観点からレビューを提供してください。`;
    }

    // ストリーミングレスポンス
    const result = streamText({
      model: google(selectedModel),
      system: systemPrompt,
      messages: coreMessages,
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
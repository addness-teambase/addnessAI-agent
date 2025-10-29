import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Dify File Upload API
 * ファイルをDifyにアップロードしてファイルIDを取得
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mode = formData.get('mode') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // モードに応じてAPIキーを選択
    const apiKeyMap: Record<string, string | undefined> = {
      'faq-auto-response': process.env.DIFY_FAQ_API_KEY,
      'contract-review': process.env.DIFY_CONTRACT_REVIEW_API_KEY,
    };

    const apiKey = apiKeyMap[mode as string] || process.env.DIFY_API_KEY;
    const baseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

    if (!apiKey) {
      return NextResponse.json(
        { error: `Dify API key is not configured for mode: ${mode}` },
        { status: 500 }
      );
    }

    console.log('[Dify Upload] File:', { name: file.name, type: file.type, size: file.size, mode });

    // Difyにファイルをアップロード
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('user', 'user');

    const uploadResponse = await fetch(`${baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[Dify Upload] API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload file to Dify', details: errorText },
        { status: uploadResponse.status }
      );
    }

    const uploadResult = await uploadResponse.json();
    console.log('[Dify Upload] Success:', uploadResult);

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error('[Dify Upload] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

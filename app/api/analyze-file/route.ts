import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import * as XLSX from 'xlsx';

// Node.js runtimeを使用（xlsxやpdf-parseが必要なため）
export const runtime = 'nodejs';

/**
 * File Analysis API
 * ファイルをパースしてテキスト化し、Geminiで分析する
 * PDF、Excel、CSV、画像などに対応
 */
/**
 * Excelファイルをテキスト化
 */
async function parseExcelToText(buffer: ArrayBuffer): Promise<string> {
  const workbook = XLSX.read(buffer, { type: 'array' });
  let text = '';

  workbook.SheetNames.forEach((sheetName, index) => {
    text += `\n\n=== シート${index + 1}: ${sheetName} ===\n\n`;
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    text += csv;
  });

  return text;
}

/**
 * PDFファイルをテキスト化
 */
async function parsePDFToText(buffer: ArrayBuffer): Promise<string> {
  // 動的インポートでpdf-parseを読み込み（ESMビルド問題を回避）
  // pdf-parseはCommonJS形式なのでany型でキャスト
  const pdfParse: any = await import('pdf-parse');
  const data = await pdfParse(Buffer.from(buffer));
  return data.text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[File Analysis] Processing:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // ファイル名の拡張子を取得
    const fileExtension = file.name.toLowerCase().split('.').pop() || '';

    // MIMEタイプが不正確な場合、拡張子から推測して補正
    let mimeType = file.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      switch (fileExtension) {
        case 'xlsx':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'xls':
          mimeType = 'application/vnd.ms-excel';
          break;
        case 'csv':
          mimeType = 'text/csv';
          break;
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'doc':
          mimeType = 'application/msword';
          break;
      }
    }

    // ファイルをバッファに変換
    const buffer = await file.arrayBuffer();

    // Geminiで分析
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Excel/CSVファイルかどうかを判定
    const isExcelOrCSV =
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
      mimeType === 'application/vnd.ms-excel' || // .xls
      mimeType === 'text/csv' || // .csv
      fileExtension === 'xlsx' ||
      fileExtension === 'xls' ||
      fileExtension === 'csv';

    const isPDF = mimeType === 'application/pdf' || fileExtension === 'pdf';
    const isImage = mimeType.startsWith('image/');

    console.log('[File Analysis] File type detection:', {
      originalMimeType: file.type,
      correctedMimeType: mimeType,
      extension: fileExtension,
      isExcelOrCSV,
      isPDF,
      isImage,
    });

    // ファイルをテキスト化（Excel/PDF）または画像としてBase64化
    let extractedText = '';
    let useTextMode = false;

    if (isExcelOrCSV) {
      console.log('[File Analysis] Parsing Excel/CSV file...');
      extractedText = await parseExcelToText(buffer);
      useTextMode = true;
    } else if (isPDF) {
      console.log('[File Analysis] Parsing PDF file...');
      extractedText = await parsePDFToText(buffer);
      useTextMode = true;
    }

    console.log('[File Analysis] Extraction result:', {
      useTextMode,
      textLength: extractedText.length,
    });

    // ファイルタイプに応じたプロンプトを作成
    let analysisPrompt = '';

    if (isPDF) {
      analysisPrompt = `以下はPDFファイルから抽出したテキストです。このPDFの内容を詳細に分析してください。

【文書タイプ】
【概要】
【主要な内容】
【重要なポイント】
【データや数値】（ある場合）
【その他の特記事項】

できるだけ詳しく、構造化して説明してください。

---抽出されたテキスト---
${extractedText}`;
    } else if (isExcelOrCSV) {
      analysisPrompt = `以下はExcel/CSVファイルから抽出したデータです。このデータを詳細に分析してください。

【シート構成】
【データの概要】
【主要な列と項目】
【数値データの要約】（合計、平均、最大値、最小値など）
【データの傾向】
【特徴的なパターン】

表形式のデータを理解して、分析結果を提供してください。

---抽出されたデータ---
${extractedText}`;
    } else if (isImage) {
      analysisPrompt = `この画像の内容を詳細に分析してください。以下の形式で出力してください：

【画像の種類】
【主な内容】
【詳細な説明】
【テキスト情報】（ある場合）
【特徴的な要素】

視覚的な情報を詳しく文字で説明してください。`;
    } else {
      analysisPrompt = `このファイルの内容を詳細に分析し、テキストとして説明してください。`;
    }

    // Geminiで分析
    let result;
    try {
      console.log('[File Analysis] Attempting Gemini 2.5 Flash analysis...');

      if (useTextMode) {
        // テキストモード：抽出したテキストのみを送信
        result = await generateText({
          model: google('gemini-2.5-flash'),
          messages: [
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
        });
      } else if (isImage) {
        // 画像モード：画像ファイルとして送信
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64}`;

        result = await generateText({
          model: google('gemini-2.5-flash'),
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: analysisPrompt,
                },
                {
                  type: 'file',
                  data: dataUrl,
                  mimeType: mimeType,
                },
              ],
            },
          ],
        });
      } else {
        // その他：テキストとして送信
        result = await generateText({
          model: google('gemini-2.5-flash'),
          messages: [
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
        });
      }
    } catch (error) {
      console.warn('[File Analysis] Gemini 2.5 Flash failed, trying 2.5 Pro:', error);

      // フォールバック: Gemini 2.5 Proを試す
      if (useTextMode) {
        result = await generateText({
          model: google('gemini-2.5-pro'),
          messages: [
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
        });
      } else if (isImage) {
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64}`;

        result = await generateText({
          model: google('gemini-2.5-pro'),
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: analysisPrompt,
                },
                {
                  type: 'file',
                  data: dataUrl,
                  mimeType: mimeType,
                },
              ],
            },
          ],
        });
      } else {
        result = await generateText({
          model: google('gemini-2.5-pro'),
          messages: [
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
        });
      }
    }

    console.log('[File Analysis] Success:', {
      fileName: file.name,
      useTextMode,
      extractedTextLength: extractedText.length,
      resultTextLength: result.text.length,
      mimeType: mimeType,
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: mimeType,
      originalFileType: file.type,
      processingMode: useTextMode ? 'text' : isImage ? 'image' : 'direct',
      extractedTextLength: extractedText.length,
      analysis: result.text,
    });
  } catch (error) {
    console.error('[File Analysis] Error:', error);

    let errorMessage = 'File analysis failed';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';

    // より詳細なエラーメッセージを提供
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API key configuration error';
        errorDetails = 'Gemini API key is not properly configured. Please check your environment variables.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded';
        errorDetails = 'Gemini API quota has been exceeded. Please try again later.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout';
        errorDetails = 'The file analysis took too long. Please try with a smaller file.';
      } else if (error.message.includes('unsupported')) {
        errorMessage = 'Unsupported file type';
        errorDetails = 'The file type is not supported by Gemini API.';
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    );
  }
}

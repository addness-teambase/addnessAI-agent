import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

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
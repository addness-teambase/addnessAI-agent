# API設定整理バックアップ - 2025-10-26

## 概要

このファイルは、2025年10月26日に実施したAPI設定の整理・クリーンアップのバックアップです。
削除したファイルや設定を復元する場合は、このファイルを参照してください。

---

## 削除されたファイル一覧

### 環境変数ファイル（バックアップ）

#### 1. `.env.bak` （削除済み）
```env
# ============================================
# 🚀 必須API（無料で始められる）
# ============================================

# 🌟 Google Gemini API（無料）
# 取得方法: https://aistudio.google.com/app/apikey
# 無料枠: 1分間15リクエスト、1日1,500リクエスト
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s
GEMINI_API_KEY=AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s

# 🔍 Brave Search API（無料）
# 取得方法: https://api.search.brave.com/app/keys
# 無料枠: 月間2,000クエリ
BRAVE_API_KEY=your_brave_api_key_here


# ============================================
# 💎 オプションAI API（高度な機能用）
# ============================================

# 🤖 Anthropic Claude API
# 取得方法: https://console.anthropic.com/settings/keys
# 用途: 高度な推論、コード生成
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 🧠 OpenAI GPT API
# 取得方法: https://platform.openai.com/api-keys
# 用途: GPT-4による高精度な応答
OPENAI_API_KEY=your_openai_api_key_here

# ⚡ X.AI Grok API
# 取得方法: https://x.ai/api
# 用途: X（Twitter）データとの連携
XAI_API_KEY=your_xai_api_key_here


# ============================================
# 🎨 メディア生成API（オプション）
# ============================================

# 🖼️ Fal.ai（画像/動画生成）
# 取得方法: https://fal.ai/dashboard/keys
FAL_KEY=your_fal_key_here

# 🎵 MiniMax（音声生成）
# 取得方法: https://www.minimax.io/
MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_GROUP_ID=your_minimax_group_id_here


# ============================================
# 🌐 ブラウザ自動化API（オプション）
# ============================================

# 🤖 Browserbase（ブラウザ自動化）
# 取得方法: https://www.browserbase.com/
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here


# ============================================
# 🛠️ その他の設定
# ============================================

# 環境設定
NODE_ENV=development

# 開発ツールバー（開発者向け）
NEXT_PUBLIC_STAGEWISE_ENABLED=false

# Node.js v24 compatibility
HOSTNAME=localhost
NODE_OPTIONS=--dns-result-order=ipv4first

# ============================================
# 🤖 Dify API Configuration (FAQ自動応答)
# ============================================
# Dify管理画面 → 左メニュー「APIアクセス」から取得
DIFY_API_KEY=your_dify_api_key_here
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_FAQ_APP_ID=app-uyTWjRVJlh6NhZp1WYbJproQ

```

**復元方法:**
```bash
# このファイルを .env.bak として復元
cat BACKUP_CLEANUP_2025-10-26.md | sed -n '/^#### 1\. `.env.bak`/,/^```$/p' | sed '1,2d;$d' > .env.bak
```

---

#### 2. `.env.bak2` （削除済み）

**重要:** `.env.bak2`には異なるGemini APIキーが含まれていました！

```env
# ============================================
# 🚀 必須API（無料で始められる）
# ============================================

# 🌟 Google Gemini API（無料）
# 取得方法: https://aistudio.google.com/app/apikey
# 無料枠: 1分間15リクエスト、1日1,500リクエスト
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyDxCvvEp_CJuLvDUGwsdV7BdPGyC1Sml_o
GEMINI_API_KEY=AIzaSyDxCvvEp_CJuLvDUGwsdV7BdPGyC1Sml_o

# 🔍 Brave Search API（無料）
# 取得方法: https://api.search.brave.com/app/keys
# 無料枠: 月間2,000クエリ
BRAVE_API_KEY=your_brave_api_key_here


# ============================================
# 💎 オプションAI API（高度な機能用）
# ============================================

# 🤖 Anthropic Claude API
# 取得方法: https://console.anthropic.com/settings/keys
# 用途: 高度な推論、コード生成
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 🧠 OpenAI GPT API
# 取得方法: https://platform.openai.com/api-keys
# 用途: GPT-4による高精度な応答
OPENAI_API_KEY=your_openai_api_key_here

# ⚡ X.AI Grok API
# 取得方法: https://x.ai/api
# 用途: X（Twitter）データとの連携
XAI_API_KEY=your_xai_api_key_here


# ============================================
# 🎨 メディア生成API（オプション）
# ============================================

# 🖼️ Fal.ai（画像/動画生成）
# 取得方法: https://fal.ai/dashboard/keys
FAL_KEY=your_fal_key_here

# 🎵 MiniMax（音声生成）
# 取得方法: https://www.minimax.io/
MINIMAX_API_KEY=your_minimax_api_key_here
MINIMAX_GROUP_ID=your_minimax_group_id_here


# ============================================
# 🌐 ブラウザ自動化API（オプション）
# ============================================

# 🤖 Browserbase（ブラウザ自動化）
# 取得方法: https://www.browserbase.com/
BROWSERBASE_API_KEY=your_browserbase_api_key_here
BROWSERBASE_PROJECT_ID=your_browserbase_project_id_here


# ============================================
# 🛠️ その他の設定
# ============================================

# 環境設定
NODE_ENV=development

# 開発ツールバー（開発者向け）
NEXT_PUBLIC_STAGEWISE_ENABLED=false

# Node.js v24 compatibility
HOSTNAME=localhost
NODE_OPTIONS=--dns-result-order=ipv4first

# ============================================
# 🤖 Dify API Configuration (FAQ自動応答)
# ============================================
# Dify管理画面 → 左メニュー「APIアクセス」から取得
DIFY_API_KEY=app-uyTWjRVJlh6NhZp1WYbJproQ
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_FAQ_APP_ID=your_app_id_here

```

**API キーの違い:**
- `.env.bak`: `GEMINI_API_KEY=AIzaSyC9cFWJrcrT-oiTxxr0ln1CtaxjNYhAF1s`
- `.env.bak2`: `GEMINI_API_KEY=AIzaSyDxCvvEp_CJuLvDUGwsdV7BdPGyC1Sml_o` ← **異なるキー**

**復元方法:**
```bash
# このファイルを .env.bak2 として復元
# （手動で該当セクションをコピーして保存してください）
```

---

### PPTXエクスポートファイル（無効化済み）

すべてのPPTXエクスポートエンドポイントは、デプロイ時の依存関係問題により既に無効化されていました。
これらのファイルは完全に削除しても問題ありません。

#### 3. `app/api/export-pptx/route.ts` （削除済み）

<details>
<summary>ファイル内容を表示</summary>

```typescript
// TEMPORARILY DISABLED FOR DEPLOYMENT - PPTX Export functionality
// This endpoint has been disabled to resolve dependency issues during deployment
// All original code has been commented out below

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'PPTX export is temporarily disabled for deployment',
      message: 'This feature will be re-enabled after resolving dependency issues'
    },
    { status: 503 }
  );
}

/*
// ORIGINAL CODE - COMMENTED OUT FOR DEPLOYMENT
import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

interface SlideImage {
  imageData: string; // base64 encoded image
  width: number;
  height: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slides, title = 'プレゼンテーション' } = body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { error: 'スライド画像が提供されていません' },
        { status: 400 }
      );
    }

    // Create new presentation
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = 'AI Agent Presentation';
    pptx.company = 'AI Generated';
    pptx.revision = '1';
    pptx.subject = title;
    pptx.title = title;

    // Add slides
    for (let i = 0; i < slides.length; i++) {
      const slideData: SlideImage = slides[i];
      const slide = pptx.addSlide();

      // Add image to slide
      slide.addImage({
        data: slideData.imageData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%'
      });
    }

    // Generate PPTX
    const pptxBuffer = await pptx.write({ outputType: 'nodebuffer' });

    // Convert buffer to base64
    const base64 = pptxBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      data: base64,
      filename: `${title}.pptx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    });

  } catch (error) {
    console.error('PPTX export error:', error);
    return NextResponse.json(
      { error: 'PPTX生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
*/
```

</details>

---

#### 4. `app/api/export-pptx-advanced/route.ts` （削除済み）

```typescript
// TEMPORARILY DISABLED FOR DEPLOYMENT - Advanced PPTX Export functionality
// This endpoint has been disabled to resolve Puppeteer dependency issues during deployment
// All original code has been commented out below

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Advanced PPTX export is temporarily disabled for deployment',
      message: 'This feature will be re-enabled after resolving Puppeteer dependency issues'
    },
    { status: 503 }
  );
}

/*
// ORIGINAL CODE - COMMENTED OUT FOR DEPLOYMENT
// (All original implementation code would be here)
// This included Puppeteer-based HTML to PPTX conversion
*/
```

---

#### 5. `app/api/export-pptx-nutrient/route.ts` （削除済み）

```typescript
// TEMPORARILY DISABLED FOR DEPLOYMENT - Nutrient PPTX Export functionality
// This endpoint has been disabled to resolve external dependency issues during deployment
// All original code has been commented out below

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Nutrient PPTX export is temporarily disabled for deployment',
      message: 'This feature will be re-enabled after resolving dependency issues'
    },
    { status: 503 }
  );
}

/*
// ORIGINAL CODE - COMMENTED OUT FOR DEPLOYMENT
// (All original implementation code would be here)
// This included Nutrient API-based HTML to PPTX conversion
*/
```

---

#### 6. `app/api/export-pptx-advanced-hybrid/route.ts` （削除済み）

```typescript
// TEMPORARILY DISABLED FOR DEPLOYMENT - Hybrid PPTX Export functionality
// This endpoint has been disabled to resolve Puppeteer dependency issues during deployment
// All original code has been commented out below

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Hybrid PPTX export is temporarily disabled for deployment',
      message: 'This feature will be re-enabled after resolving Puppeteer dependency issues'
    },
    { status: 503 }
  );
}

/*
// ORIGINAL CODE - COMMENTED OUT FOR DEPLOYMENT
// (All original implementation code would be here)
// This included hybrid Puppeteer + PptxGenJS implementation
*/
```

---

### 未使用のMastraツール

以下の4つのツールは `src/mastra/index.ts` に登録されておらず、使用されていませんでした。

#### 7. `src/mastra/tools/contentSynthesisTool.ts` （削除済み）

<details>
<summary>ファイル内容を表示（374行）</summary>

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, LanguageModel } from 'ai';

const synthesisOutputSchema = z.object({
  executiveSummary: z.string(),
  mainFindings: z.array(z.object({
    finding: z.string(),
    supportingSources: z.array(z.string()),
    confidence: z.number(),
    evidence: z.string(),
  })),
  thematicAnalysis: z.array(z.object({
    theme: z.string(),
    description: z.string(),
    sources: z.array(z.string()),
    keyPoints: z.array(z.string()),
  })),
  conflicts: z.array(z.object({
    topic: z.string(),
    conflictingViews: z.array(z.object({
      position: z.string(),
      sources: z.array(z.string()),
      evidence: z.string(),
    })),
    resolution: z.string().optional(),
  })).optional(),
  knowledgeGaps: z.array(z.object({
    gap: z.string(),
    impact: z.string(),
    suggestedResearch: z.string(),
  })),
  insights: z.array(z.object({
    insight: z.string(),
    reasoning: z.string(),
    implications: z.string(),
  })),
  qualityAssessment: z.object({
    sourceReliability: z.string(),
    evidenceStrength: z.string(),
    biasRisks: z.array(z.string()),
    limitations: z.array(z.string()),
  }),
});

type SynthesisOutput = z.infer<typeof synthesisOutputSchema>;

const inputSchema = z.object({
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().optional(),
    author: z.string().optional(),
    content: z.string(),
    credibilityScore: z.number().optional(),
    sourceType: z.string().optional(),
    publishDate: z.string().optional(),
  })).describe('Sources to synthesize'),
  researchQuestion: z.string().describe('The main research question or topic'),
  synthesisType: z.enum(['overview', 'comparative', 'analytical', 'narrative', 'argumentative']).default('analytical').describe('Type of synthesis to perform'),
  outputFormat: z.enum(['structured', 'narrative', 'academic', 'executive-summary']).default('structured').describe('Format for the synthesized output'),
  includeConflicts: z.boolean().default(true).describe('Identify and address conflicting information'),
  confidenceThreshold: z.number().min(0).max(1).default(0.7).describe('Minimum confidence level for including information'),
});

function buildSynthesisPrompt(context: z.infer<typeof inputSchema>) {
  const {
    sources,
    researchQuestion,
    synthesisType,
    outputFormat,
    includeConflicts,
    confidenceThreshold
  } = context;

  const sourceData = sources.map((source, index) => ({
    id: index + 1,
    title: source.title,
    author: source.author || 'Unknown',
    content: source.content.substring(0, 2000), // Limit content length
    credibility: source.credibilityScore || 0.5,
    type: source.sourceType || 'unknown',
    date: source.publishDate || 'unknown',
    url: source.url || 'N/A',
  }));

  return `
You are conducting a comprehensive synthesis of research sources. Analyze the following sources and create a high-quality synthesis.

Research Question: ${researchQuestion}
Synthesis Type: ${synthesisType}
Output Format: ${outputFormat}
Include Conflicts: ${includeConflicts}
Confidence Threshold: ${confidenceThreshold}

Sources to Synthesize:
${sourceData.map(source => `
Source ${source.id}:
Title: ${source.title}
Author: ${source.author}
Type: ${source.type}
Date: ${source.date}
Credibility: ${source.credibility}
Content: ${source.content}
---
`).join('\n')}

Please perform a comprehensive synthesis that includes:

1. EXECUTIVE SUMMARY (2-3 paragraphs summarizing key findings)

2. MAIN FINDINGS (Identify 3-5 key findings with supporting evidence)
   - For each finding, include confidence level (0-1)
   - List supporting sources
   - Provide evidence summary

3. THEMATIC ANALYSIS (Group information by major themes)
   - Identify 3-5 major themes
   - Describe each theme with supporting sources
   - Extract key points for each theme

4. CONFLICT IDENTIFICATION ${includeConflicts ? '(Required)' : '(Optional)'}
   - Identify contradictory information
   - Present different viewpoints with sources
   - Attempt resolution or note unresolved conflicts

5. KNOWLEDGE GAPS
   - Identify what's missing from current sources
   - Assess impact of gaps on conclusions
   - Suggest additional research needed

6. INSIGHTS AND IMPLICATIONS
   - Generate novel insights from synthesis
   - Identify patterns not obvious in individual sources
   - Discuss broader implications

7. QUALITY ASSESSMENT
   - Overall source reliability
   - Evidence strength
   - Potential bias risks
   - Study limitations

Provide your response in the following JSON format:
{
  "executiveSummary": "comprehensive summary",
  "mainFindings": [
    {
      "finding": "finding description",
      "supportingSources": ["source titles"],
      "confidence": 0.8,
      "evidence": "evidence summary"
    }
  ],
  "thematicAnalysis": [
    {
      "theme": "theme name",
      "description": "theme description",
      "sources": ["source titles"],
      "keyPoints": ["point1", "point2"]
    }
  ],
  "conflicts": [
    {
      "topic": "conflict topic",
      "conflictingViews": [
        {
          "position": "position description",
          "sources": ["source titles"],
          "evidence": "supporting evidence"
        }
      ],
      "resolution": "resolution if possible"
    }
  ],
  "knowledgeGaps": [
    {
      "gap": "gap description",
      "impact": "impact on research",
      "suggestedResearch": "suggested next steps"
    }
  ],
  "insights": [
    {
      "insight": "novel insight",
      "reasoning": "reasoning behind insight",
      "implications": "broader implications"
    }
  ],
  "qualityAssessment": {
    "sourceReliability": "assessment",
    "evidenceStrength": "assessment",
    "biasRisks": ["risk1", "risk2"],
    "limitations": ["limitation1", "limitation2"]
  }
}

Focus on quality over quantity. Ensure all findings meet the confidence threshold of ${confidenceThreshold}.
`;
}

async function generateAndParseResponse(
  model: LanguageModel,
  prompt: string,
  sources: z.infer<typeof inputSchema>['sources']
): Promise<SynthesisOutput> {
  const response = await generateText({
    model,
    prompt,
  });

  try {
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (parseError) {
    return {
      executiveSummary: response.text.substring(0, 500) + '...',
      mainFindings: [
        {
          finding: 'Synthesis completed with limitations',
          supportingSources: sources.map(s => s.title),
          confidence: 0.5,
          evidence: 'Automated analysis performed',
        },
      ],
      thematicAnalysis: [
        {
          theme: 'General Analysis',
          description: 'Analysis of provided sources',
          sources: sources.map(s => s.title),
          keyPoints: ['Content reviewed', 'Basic synthesis attempted'],
        },
      ],
      knowledgeGaps: [
        {
          gap: 'Detailed analysis incomplete',
          impact: 'Limited synthesis quality',
          suggestedResearch: 'Manual review recommended',
        },
      ],
      insights: [
        {
          insight: 'Automated synthesis has limitations',
          reasoning: 'Complex synthesis requires human oversight',
          implications: 'Results should be verified manually',
        },
      ],
      qualityAssessment: {
        sourceReliability: 'Variable',
        evidenceStrength: 'Moderate',
        biasRisks: ['Automated analysis limitations'],
        limitations: ['Parsing errors', 'Limited context understanding'],
      },
    };
  }
}

function formatStructuredOutput(
  outputFormat: z.infer<typeof inputSchema>['outputFormat'],
  synthesis: SynthesisOutput,
  researchQuestion: string
): string {
  switch (outputFormat) {
    case 'academic':
      return `# Research Synthesis: ${researchQuestion}

## Abstract
${synthesis.executiveSummary}

## Main Findings
${synthesis.mainFindings?.map((f, i) => `${i + 1}. ${f.finding} (Confidence: ${f.confidence})\n   Evidence: ${f.evidence}`).join('\n\n')}

## Thematic Analysis
${synthesis.thematicAnalysis?.map(t => `### ${t.theme}\n${t.description}\nKey Points: ${t.keyPoints?.join(', ')}`).join('\n\n')}

## Limitations and Future Research
${synthesis.knowledgeGaps?.map(g => `- ${g.gap}: ${g.suggestedResearch}`).join('\n')}`;

    case 'executive-summary':
      return `# Executive Summary: ${researchQuestion}

${synthesis.executiveSummary}

## Key Findings
${synthesis.mainFindings?.map(f => `• ${f.finding}`).join('\n')}

## Recommendations
${synthesis.insights?.map(i => `• ${i.insight}`).join('\n')}`;

    case 'narrative':
      return `# ${researchQuestion}

${synthesis.executiveSummary}

The research reveals several key themes: ${synthesis.thematicAnalysis?.map(t => t.theme).join(', ')}.

${synthesis.mainFindings?.map(f => f.finding).join(' ')}

Key insights from this synthesis include: ${synthesis.insights?.map(i => i.insight).join(' ')}`;

    default: // structured
      return JSON.stringify(synthesis, null, 2);
  }
}

/**
 * contentSynthesisTool
 * --------------------
 * Synthesizes information from multiple sources to create comprehensive,
 * well-structured research outputs. Identifies patterns, resolves contradictions,
 * and generates insights that go beyond simple aggregation.
 */
export const contentSynthesisTool = createTool({
  id: 'content-synthesis',
  description: 'Synthesize information from multiple sources to create comprehensive research outputs with analysis and insights.',
  inputSchema,
  outputSchema: z.object({
    success: z.boolean(),
    synthesis: synthesisOutputSchema,
    structuredOutput: z.string(),
    citations: z.array(z.string()),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { sources, researchQuestion, synthesisType, outputFormat } = context;
      const model = anthropic('claude-opus-4-20250514');

      const synthesisPrompt = buildSynthesisPrompt(context);

      const synthesis = await generateAndParseResponse(model, synthesisPrompt, sources);

      const structuredOutput = formatStructuredOutput(outputFormat, synthesis, researchQuestion);

      // Generate citations list
      const citations = sources.map(source =>
        `${source.author || 'Unknown'}. ${source.title}. ${source.url || 'N/A'}`
      );

      return {
        success: true,
        synthesis,
        structuredOutput,
        citations,
        message: `Successfully synthesized ${sources.length} sources using ${synthesisType} approach in ${outputFormat} format.`,
      };

    } catch (error) {
      console.error('Content synthesis error:', error);
      return {
        success: false,
        synthesis: {
          executiveSummary: 'Synthesis failed',
          mainFindings: [],
          thematicAnalysis: [],
          knowledgeGaps: [],
          insights: [],
          qualityAssessment: {
            sourceReliability: 'Unknown',
            evidenceStrength: 'Unknown',
            biasRisks: ['Synthesis failure'],
            limitations: ['Tool error'],
          },
        },
        structuredOutput: 'Synthesis failed due to processing error',
        citations: [],
        message: `Synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
```

</details>

**復元方法:**
このファイルを復元する場合は、`src/mastra/tools/contentSynthesisTool.ts` に上記コードをコピーし、
`src/mastra/index.ts` に以下のインポートを追加してください：

```typescript
import { contentSynthesisTool } from './tools/contentSynthesisTool';
```

そして、agent定義に追加：
```typescript
tools: {
  // ... existing tools
  contentSynthesisTool,
}
```

---

#### 8. `src/mastra/tools/sourceValidationTool.ts` （削除済み）

<details>
<summary>ファイル内容を表示（234行）</summary>

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

/**
 * sourceValidationTool
 * --------------------
 * Validates the credibility, bias, and reliability of information sources.
 * Uses domain knowledge, publication patterns, and content analysis to assess
 * source quality for research purposes.
 */
export const sourceValidationTool = createTool({
  id: 'source-validation',
  description: 'Validate the credibility, bias, and reliability of information sources for research purposes.',
  inputSchema: z.object({
    sources: z.array(z.object({
      url: z.string().url(),
      title: z.string(),
      author: z.string().optional(),
      publishDate: z.string().optional(),
      content: z.string().optional(),
    })).describe('Sources to validate'),
    validationCriteria: z.array(z.enum(['authority', 'accuracy', 'objectivity', 'currency', 'coverage'])).default(['authority', 'accuracy', 'objectivity']).describe('Criteria to evaluate'),
    researchTopic: z.string().optional().describe('Research topic for context-specific validation'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    validationResults: z.array(z.object({
      url: z.string(),
      overallScore: z.number().min(0).max(10),
      credibilityLevel: z.enum(['high', 'medium', 'low', 'questionable']),
      strengths: z.array(z.string()),
      concerns: z.array(z.string()),
      biasAssessment: z.object({
        politicalBias: z.string(),
        commercialBias: z.string(),
        selectionBias: z.string(),
        confirmationBias: z.string(),
      }),
      sourceClassification: z.object({
        type: z.string(), // academic, news, government, commercial, blog, etc.
        tier: z.enum(['tier1', 'tier2', 'tier3', 'tier4']),
        expertise: z.string(),
      }),
      recommendations: z.array(z.string()),
    })),
    summary: z.object({
      highQualitySources: z.number(),
      mediumQualitySources: z.number(),
      lowQualitySources: z.number(),
      overallReliability: z.string(),
      recommendedActions: z.array(z.string()),
    }),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { sources, validationCriteria, researchTopic } = context;
      const model = anthropic('claude-opus-4-20250514');

      const validationResults = [];

      for (const source of sources) {
        const validationPrompt = `
Validate the following source for research credibility and bias:

URL: ${source.url}
Title: ${source.title}
Author: ${source.author || 'Not specified'}
Publish Date: ${source.publishDate || 'Not specified'}
${researchTopic ? `Research Topic Context: ${researchTopic}` : ''}

Validation Criteria: ${validationCriteria.join(', ')}

Please evaluate this source based on the following:

1. AUTHORITY: Author expertise, institutional affiliation, domain reputation
2. ACCURACY: Factual correctness, evidence quality, peer review status
3. OBJECTIVITY: Bias assessment, balanced perspective, conflicts of interest
4. CURRENCY: Information recency, relevance to current context
5. COVERAGE: Comprehensiveness, scope appropriateness

For domain analysis, consider:
- .edu, .gov, .org domains (generally higher credibility)
- Major news organizations vs. blog posts
- Academic journals vs. commercial sites
- Professional organizations vs. personal websites

Provide your assessment in the following JSON format:
{
  "overallScore": 0-10,
  "credibilityLevel": "high/medium/low/questionable",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"],
  "biasAssessment": {
    "politicalBias": "assessment of political slant",
    "commercialBias": "assessment of commercial interests",
    "selectionBias": "assessment of selective reporting",
    "confirmationBias": "assessment of confirmation bias"
  },
  "sourceClassification": {
    "type": "academic/news/government/commercial/blog/social/other",
    "tier": "tier1/tier2/tier3/tier4",
    "expertise": "assessment of author/publication expertise"
  },
  "recommendations": ["recommendation1", "recommendation2"]
}

Tier Definitions:
- Tier 1: Peer-reviewed academic, government agencies, established institutions
- Tier 2: Major news organizations, professional publications, expert analysis
- Tier 3: Reputable blogs, industry publications, advocacy organizations
- Tier 4: Personal blogs, social media, unverified sources
`;

        try {
          const response = await generateText({
            model,
            prompt: validationPrompt,
          });

          let validation;
          try {
            const jsonMatch = response.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              validation = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('No JSON found');
            }
          } catch (parseError) {
            // Fallback validation
            const domain = new URL(source.url).hostname;
            const domainLevel = domain.includes('.edu') || domain.includes('.gov') ? 'high' :
                               domain.includes('.org') ? 'medium' : 'low';

            validation = {
              overallScore: domainLevel === 'high' ? 7 : domainLevel === 'medium' ? 5 : 3,
              credibilityLevel: domainLevel,
              strengths: [domainLevel === 'high' ? 'Authoritative domain' : 'Basic analysis completed'],
              concerns: ['Automated analysis only', 'Manual review recommended'],
              biasAssessment: {
                politicalBias: 'Unable to assess automatically',
                commercialBias: 'Unable to assess automatically',
                selectionBias: 'Unable to assess automatically',
                confirmationBias: 'Unable to assess automatically',
              },
              sourceClassification: {
                type: 'other',
                tier: 'tier3',
                expertise: 'Unable to assess automatically',
              },
              recommendations: ['Manual review required', 'Cross-reference with other sources'],
            };
          }

          validationResults.push({
            url: source.url,
            ...validation,
          });

        } catch (error) {
          // Error handling for individual source
          validationResults.push({
            url: source.url,
            overallScore: 0,
            credibilityLevel: 'questionable' as const,
            strengths: [],
            concerns: ['Validation failed', 'Source inaccessible'],
            biasAssessment: {
              politicalBias: 'Unable to assess',
              commercialBias: 'Unable to assess',
              selectionBias: 'Unable to assess',
              confirmationBias: 'Unable to assess',
            },
            sourceClassification: {
              type: 'other',
              tier: 'tier4' as const,
              expertise: 'Unable to assess',
            },
            recommendations: ['Source validation failed', 'Consider alternative sources'],
          });
        }
      }

      // Calculate summary statistics
      const highQuality = validationResults.filter(r => r.credibilityLevel === 'high').length;
      const mediumQuality = validationResults.filter(r => r.credibilityLevel === 'medium').length;
      const lowQuality = validationResults.filter(r => r.credibilityLevel === 'low' || r.credibilityLevel === 'questionable').length;

      const averageScore = validationResults.reduce((sum, r) => sum + r.overallScore, 0) / validationResults.length;
      const overallReliability = averageScore >= 7 ? 'High' : averageScore >= 5 ? 'Medium' : 'Low';

      const recommendedActions = [];
      if (lowQuality > highQuality) {
        recommendedActions.push('Seek higher quality sources');
      }
      if (validationResults.some(r => r.concerns.length > 2)) {
        recommendedActions.push('Cross-verify information with multiple sources');
      }
      if (highQuality === 0) {
        recommendedActions.push('Find authoritative sources before proceeding');
      }

      return {
        success: true,
        validationResults,
        summary: {
          highQualitySources: highQuality,
          mediumQualitySources: mediumQuality,
          lowQualitySources: lowQuality,
          overallReliability,
          recommendedActions,
        },
        message: `Validated ${sources.length} sources. Overall reliability: ${overallReliability}`,
      };

    } catch (error) {
      console.error('Source validation error:', error);
      return {
        success: false,
        validationResults: [],
        summary: {
          highQualitySources: 0,
          mediumQualitySources: 0,
          lowQualitySources: 0,
          overallReliability: 'Unknown',
          recommendedActions: ['Validation failed - manual review required'],
        },
        message: `Source validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
```

</details>

**復元方法:** `src/mastra/tools/sourceValidationTool.ts` に上記コードをコピーして復元

---

#### 9. `src/mastra/tools/websiteAnalysisTool.ts` （削除済み）

<details>
<summary>ファイル内容を表示（166行）</summary>

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

/**
 * websiteAnalysisTool
 * -------------------
 * Performs deep analysis of specific websites and documents using browser automation
 * and AI-powered content analysis. Extracts structured information, identifies key themes,
 * and evaluates source credibility.
 */
export const websiteAnalysisTool = createTool({
  id: 'website-analysis',
  description: 'Analyze websites or documents for research purposes, extracting structured information, key themes, and credibility indicators.',
  inputSchema: z.object({
    url: z.string().url().describe('URL of the website or document to analyze'),
    analysisType: z.enum(['overview', 'detailed', 'fact-extraction', 'credibility']).default('overview').describe('Type of analysis to perform'),
    focusAreas: z.array(z.string()).optional().describe('Specific topics or areas to focus the analysis on'),
    extractQuotes: z.boolean().default(false).describe('Whether to extract relevant quotes for citation'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    analysis: z.object({
      title: z.string(),
      domain: z.string(),
      publishDate: z.string().optional(),
      author: z.string().optional(),
      summary: z.string(),
      keyThemes: z.array(z.string()),
      mainPoints: z.array(z.string()),
      quotes: z.array(z.object({
        text: z.string(),
        context: z.string(),
      })).optional(),
      credibilityIndicators: z.object({
        hasAuthor: z.boolean(),
        hasDate: z.boolean(),
        domainAuthority: z.string(),
        sourceType: z.string(), // academic, news, blog, government, etc.
        biasIndicators: z.array(z.string()),
      }),
      relatedLinks: z.array(z.object({
        url: z.string(),
        title: z.string(),
        relevance: z.string(),
      })),
    }),
    extractedData: z.any().optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { url, analysisType, focusAreas, extractQuotes } = context;

      // For this implementation, we'll use a combination of URL analysis and AI reasoning
      // In a production environment, this would integrate with browser automation tools

      const model = anthropic('claude-opus-4-20250514');

      // Extract domain and basic URL information
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // Create analysis prompt based on type and focus areas
      const analysisPrompt = `
Analyze the following URL for research purposes: ${url}

Analysis Type: ${analysisType}
${focusAreas && focusAreas.length > 0 ? `Focus Areas: ${focusAreas.join(', ')}` : ''}
${extractQuotes ? 'Please extract relevant quotes for citation.' : ''}

Please provide a comprehensive analysis including:
1. Content summary and key themes
2. Main points and arguments
3. Author and publication information (if available)
4. Source credibility assessment
5. Potential bias indicators
6. Related information or links mentioned
${extractQuotes ? '7. Notable quotes with context' : ''}

Based on the URL structure and domain, provide your analysis in the following JSON format:
{
  "title": "Inferred title or topic",
  "domain": "${domain}",
  "publishDate": "Date if determinable from URL or null",
  "author": "Author if determinable or null",
  "summary": "Brief summary of expected content",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "mainPoints": ["point1", "point2", "point3"],
  ${extractQuotes ? '"quotes": [{"text": "quote", "context": "context"}],' : ''}
  "credibilityIndicators": {
    "hasAuthor": true/false,
    "hasDate": true/false,
    "domainAuthority": "high/medium/low",
    "sourceType": "academic/news/blog/government/commercial/other",
    "biasIndicators": ["indicator1", "indicator2"]
  },
  "relatedLinks": [{"url": "link", "title": "title", "relevance": "relevance"}]
}

Note: Since I cannot directly access the content, provide the best analysis possible based on the URL structure, domain knowledge, and reasonable inferences about the content type and credibility.
`;

      const response = await generateText({
        model,
        prompt: analysisPrompt,
      });

      let analysis;
      try {
        // Try to parse JSON response
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // Fallback analysis if JSON parsing fails
        analysis = {
          title: `Analysis of ${domain}`,
          domain,
          summary: response.text,
          keyThemes: ['Content analysis', 'Source evaluation'],
          mainPoints: ['Analysis completed', 'Manual review recommended'],
          credibilityIndicators: {
            hasAuthor: false,
            hasDate: false,
            domainAuthority: 'unknown',
            sourceType: 'other',
            biasIndicators: ['Analysis incomplete'],
          },
          relatedLinks: [],
        };
      }

      return {
        success: true,
        analysis,
        message: `Successfully analyzed ${url} with ${analysisType} analysis.`,
      };
    } catch (error) {
      console.error('Website analysis error:', error);
      return {
        success: false,
        analysis: {
          title: 'Analysis Error',
          domain: '',
          summary: 'Failed to analyze website',
          keyThemes: [],
          mainPoints: [],
          credibilityIndicators: {
            hasAuthor: false,
            hasDate: false,
            domainAuthority: 'unknown',
            sourceType: 'other',
            biasIndicators: ['Analysis failed'],
          },
          relatedLinks: [],
        },
        message: `Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
```

</details>

**復元方法:** `src/mastra/tools/websiteAnalysisTool.ts` に上記コードをコピーして復元

---

#### 10. `src/mastra/tools/citationExtractionTool.ts` （削除済み）

<details>
<summary>ファイル内容を表示（229行）</summary>

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

/**
 * citationExtractionTool
 * ----------------------
 * Generates proper academic citations in multiple formats (APA, MLA, Chicago)
 * from web sources, documents, and research materials. Extracts metadata
 * and formats citations according to academic standards.
 */
export const citationExtractionTool = createTool({
  id: 'citation-extraction',
  description: 'Generate proper academic citations in multiple formats from web sources and research materials.',
  inputSchema: z.object({
    sources: z.array(z.object({
      url: z.string().url(),
      title: z.string(),
      author: z.string().optional(),
      publishDate: z.string().optional(),
      accessDate: z.string().optional(),
      publisher: z.string().optional(),
      sourceType: z.enum(['webpage', 'article', 'academic', 'news', 'book', 'report', 'other']).default('webpage'),
      additionalInfo: z.object({
        volume: z.string().optional(),
        issue: z.string().optional(),
        pages: z.string().optional(),
        doi: z.string().optional(),
        isbn: z.string().optional(),
      }).optional(),
    })).describe('Sources to generate citations for'),
    citationStyle: z.enum(['APA', 'MLA', 'Chicago', 'all']).default('APA').describe('Citation style to generate'),
    includeInText: z.boolean().default(true).describe('Include in-text citation examples'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    citations: z.array(z.object({
      url: z.string(),
      title: z.string(),
      metadata: z.object({
        author: z.string(),
        publishDate: z.string(),
        accessDate: z.string(),
        publisher: z.string(),
        sourceType: z.string(),
      }),
      citations: z.object({
        APA: z.string().optional(),
        MLA: z.string().optional(),
        Chicago: z.string().optional(),
      }),
      inTextCitation: z.object({
        APA: z.string().optional(),
        MLA: z.string().optional(),
        Chicago: z.string().optional(),
      }).optional(),
      notes: z.array(z.string()),
    })),
    bibliography: z.object({
      APA: z.array(z.string()).optional(),
      MLA: z.array(z.string()).optional(),
      Chicago: z.array(z.string()).optional(),
    }),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const { sources, citationStyle, includeInText } = context;
      const model = anthropic('claude-opus-4-20250514');

      const citations = [];
      const bibliography: { APA: string[]; MLA: string[]; Chicago: string[] } = { APA: [], MLA: [], Chicago: [] };

      for (const source of sources) {
        const currentDate = new Date().toISOString().split('T')[0];
        const accessDate = source.accessDate || currentDate;

        // Extract domain and infer publisher if not provided
        const domain = new URL(source.url).hostname;
        const inferredPublisher = source.publisher || domain.replace(/^www\./, '');

        // Clean and format metadata
        const metadata = {
          author: source.author || 'Unknown Author',
          publishDate: source.publishDate || 'n.d.',
          accessDate,
          publisher: inferredPublisher,
          sourceType: source.sourceType,
        };

        const citationPrompt = `
Generate proper academic citations for the following source:

Title: ${source.title}
Author: ${metadata.author}
URL: ${source.url}
Publisher: ${metadata.publisher}
Publish Date: ${metadata.publishDate}
Access Date: ${metadata.accessDate}
Source Type: ${metadata.sourceType}
${source.additionalInfo?.doi ? `DOI: ${source.additionalInfo.doi}` : ''}
${source.additionalInfo?.pages ? `Pages: ${source.additionalInfo.pages}` : ''}

Please generate citations in ${citationStyle === 'all' ? 'APA, MLA, and Chicago' : citationStyle} format(s).
${includeInText ? 'Also provide in-text citation examples.' : ''}

Follow these guidelines:
- Use proper formatting for each style
- Handle missing information appropriately (use "n.d." for no date, etc.)
- Format URLs and access dates correctly
- Apply proper capitalization and punctuation
- For web sources, include retrieval information as required

Provide the response in JSON format:
{
  "citations": {
    ${citationStyle === 'all' || citationStyle === 'APA' ? '"APA": "formatted APA citation",' : ''}
    ${citationStyle === 'all' || citationStyle === 'MLA' ? '"MLA": "formatted MLA citation",' : ''}
    ${citationStyle === 'all' || citationStyle === 'Chicago' ? '"Chicago": "formatted Chicago citation"' : ''}
  },
  ${includeInText ? `"inTextCitation": {
    ${citationStyle === 'all' || citationStyle === 'APA' ? '"APA": "APA in-text example",' : ''}
    ${citationStyle === 'all' || citationStyle === 'MLA' ? '"MLA": "MLA in-text example",' : ''}
    ${citationStyle === 'all' || citationStyle === 'Chicago' ? '"Chicago": "Chicago in-text example"' : ''}
  },` : ''}
  "notes": ["note1", "note2"]
}

Notes should include any formatting concerns or missing information warnings.
`;

        try {
          const response = await generateText({
            model,
            prompt: citationPrompt,
          });

          let citationData;
          try {
            const jsonMatch = response.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              citationData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('No JSON found');
            }
          } catch (parseError) {
            // Fallback citation generation
            const fallbackCitations: { APA?: string; MLA?: string; Chicago?: string } = {};
            const fallbackInText: { APA?: string; MLA?: string; Chicago?: string } | undefined = includeInText ? {} : undefined;

            citationData = {
              citations: fallbackCitations,
              inTextCitation: fallbackInText,
              notes: ['Automated citation generation - please verify formatting'],
            };

            // Basic fallback citations
            if (citationStyle === 'all' || citationStyle === 'APA') {
              citationData.citations.APA = `${metadata.author}. (${metadata.publishDate}). ${source.title}. ${metadata.publisher}. Retrieved ${metadata.accessDate}, from ${source.url}`;
              if (includeInText && citationData.inTextCitation) {
                citationData.inTextCitation.APA = `(${metadata.author}, ${metadata.publishDate})`;
              }
            }
            if (citationStyle === 'all' || citationStyle === 'MLA') {
              citationData.citations.MLA = `${metadata.author}. "${source.title}." ${metadata.publisher}, ${metadata.publishDate}, ${source.url}. Accessed ${metadata.accessDate}.`;
              if (includeInText && citationData.inTextCitation) {
                citationData.inTextCitation.MLA = `(${metadata.author})`;
              }
            }
            if (citationStyle === 'all' || citationStyle === 'Chicago') {
              citationData.citations.Chicago = `${metadata.author}. "${source.title}." ${metadata.publisher}. ${metadata.publishDate}. ${source.url} (accessed ${metadata.accessDate}).`;
              if (includeInText && citationData.inTextCitation) {
                citationData.inTextCitation.Chicago = `(${metadata.author}, ${metadata.publishDate})`;
              }
            }
          }

          citations.push({
            url: source.url,
            title: source.title,
            metadata,
            citations: citationData.citations,
            inTextCitation: citationData.inTextCitation,
            notes: citationData.notes || [],
          });

          // Add to bibliography
          if (citationData.citations.APA) bibliography.APA.push(citationData.citations.APA);
          if (citationData.citations.MLA) bibliography.MLA.push(citationData.citations.MLA);
          if (citationData.citations.Chicago) bibliography.Chicago.push(citationData.citations.Chicago);

        } catch (error) {
          console.error(`Citation generation error for ${source.url}:`, error);
          citations.push({
            url: source.url,
            title: source.title,
            metadata,
            citations: {},
            notes: ['Citation generation failed', 'Manual formatting required'],
          });
        }
      }

      // Sort bibliography alphabetically
      bibliography.APA?.sort();
      bibliography.MLA?.sort();
      bibliography.Chicago?.sort();

      return {
        success: true,
        citations,
        bibliography: Object.fromEntries(
          Object.entries(bibliography).filter(([_, value]) => value && value.length > 0)
        ),
        message: `Generated ${citationStyle === 'all' ? 'multiple format' : citationStyle} citations for ${sources.length} sources.`,
      };

    } catch (error) {
      console.error('Citation extraction error:', error);
      return {
        success: false,
        citations: [],
        bibliography: {},
        message: `Citation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});
```

</details>

**復元方法:** `src/mastra/tools/citationExtractionTool.ts` に上記コードをコピーして復元

---

## 修正された設定

### `.env` の変更

**削除された行:**

```diff
- NEXT_PUBLIC_DIFY_API_KEY=app-uyTWjRVJlh6NhZp1WYbJproQ
```

**理由:** `DIFY_API_KEY`（行79）と重複していたため。セキュリティ上、クライアント側に公開する必要はありません。

**復元方法:**
```bash
# .envファイルに以下の行を追加（行85の位置）
echo "\n# Dify API (Public - for Client-side)" >> .env
echo "NEXT_PUBLIC_DIFY_API_KEY=app-uyTWjRVJlh6NhZp1WYbJproQ" >> .env
```

---

### `next.config.js` の変更

**削除された行（6-9行目）:**

```diff
- env: {
-   OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'placeholder-for-build',
-   GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'placeholder-for-build',
- },
```

**理由:**
1. クライアント側で使用されていない
2. セキュリティリスク（APIキーがクライアントに露出）
3. サーバーサイドAPIルートのみで使用されている

**復元前の設定:**
```javascript
const nextConfig = {
  // ビルド時の環境変数デフォルト値
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'placeholder-for-build',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'placeholder-for-build',
  },
  // Next.js 15対応の設定
  devIndicators: {
    position: 'bottom-left',
  },
  // ...
```

**復元後の設定:**
```javascript
const nextConfig = {
  // Next.js 15対応の設定
  devIndicators: {
    position: 'bottom-left',
  },
  // ...
```

**復元方法:**
`next.config.js` の4行目（`const nextConfig = {` の次の行）に以下を挿入：

```javascript
  // ビルド時の環境変数デフォルト値
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'placeholder-for-build',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'placeholder-for-build',
  },
```

---

### `src/mastra/tools/graphicRecordingTool.ts` の変更

**削除された行（3行目）:**

```diff
- import { anthropic } from '@ai-sdk/anthropic';
```

**理由:** インポートされているが、コード内で使用されていない

**復元方法:**
`src/mastra/tools/graphicRecordingTool.ts` の3行目に以下を追加：

```typescript
import { anthropic } from '@ai-sdk/anthropic';
```

---

## 完全復元手順

すべての変更を元に戻す場合は、以下の手順を実行してください：

### 1. バックアップファイルの復元

```bash
# 作業ディレクトリに移動
cd /Users/kurosakiyuto/Downloads/addnessAI-agent

# .env.bak を復元
# （このバックアップファイルから手動でコピー）

# .env.bak2 を復元
# （このバックアップファイルから手動でコピー）
```

### 2. PPTXエクスポートファイルの復元

```bash
# export-pptx ディレクトリ内の4つのファイルを復元
# （このバックアップファイルから各ファイルをコピー）
```

### 3. Mastraツールの復元

```bash
# 4つの未使用ツールを復元
# contentSynthesisTool.ts
# sourceValidationTool.ts
# websiteAnalysisTool.ts
# citationExtractionTool.ts

# src/mastra/index.ts に以下のインポートを追加：
# import { contentSynthesisTool } from './tools/contentSynthesisTool';
# import { sourceValidationTool } from './tools/sourceValidationTool';
# import { websiteAnalysisTool } from './tools/websiteAnalysisTool';
# import { citationExtractionTool } from './tools/citationExtractionTool';

# そして、agent定義に追加：
# tools: {
#   // ... existing tools
#   contentSynthesisTool,
#   sourceValidationTool,
#   websiteAnalysisTool,
#   citationExtractionTool,
# }
```

### 4. 設定ファイルの復元

```bash
# .env に NEXT_PUBLIC_DIFY_API_KEY を追加
echo "" >> .env
echo "# Dify API (Public - for Client-side)" >> .env
echo "NEXT_PUBLIC_DIFY_API_KEY=app-uyTWjRVJlh6NhZp1WYbJproQ" >> .env

# next.config.js を編集して env セクションを追加
# （手動で編集してください）

# graphicRecordingTool.ts にAnthropicインポートを追加
# （手動で編集してください）
```

---

## 削除理由のまとめ

| ファイル/設定 | 削除理由 | 影響度 |
|------------|---------|-------|
| `.env.bak` | バックアップファイルのため不要 | 低 |
| `.env.bak2` | バックアップファイルのため不要（異なるAPIキーを含む） | 低 |
| `export-pptx/*.ts` (4ファイル) | 既に無効化済み、503エラーのみ返却 | 非常に低 |
| `contentSynthesisTool.ts` | `src/mastra/index.ts` に登録されていない | 低 |
| `sourceValidationTool.ts` | `src/mastra/index.ts` に登録されていない | 低 |
| `websiteAnalysisTool.ts` | `src/mastra/index.ts` に登録されていない | 低 |
| `citationExtractionTool.ts` | `src/mastra/index.ts` に登録されていない | 低 |
| `.env` の `NEXT_PUBLIC_DIFY_API_KEY` | 重複（`DIFY_API_KEY`と同じ値）、セキュリティリスク | 中 |
| `next.config.js` の `env` セクション | クライアント側で未使用、セキュリティリスク | 中 |
| `graphicRecordingTool.ts` のAnthropicインポート | コード内で使用されていない | 非常に低 |

---

## クリーンアップによる効果

### コードベースの改善

1. **ファイル削減:** 10ファイル削除（約1,500行のコード削減）
2. **セキュリティ向上:** クライアント側へのAPIキー露出を削減
3. **明確化:** 実際に使用されているコードのみが残る
4. **ビルドサイズ削減:** 未使用ツールの削除により、バンドルサイズが軽量化

### 残された問題

以下のAPI キーはまだプレースホルダーのままです：

- `ANTHROPIC_API_KEY=your_anthropic_api_key_here`
- `OPENAI_API_KEY=your_openai_api_key_here`
- `XAI_API_KEY=your_xai_api_key_here`
- `BRAVE_API_KEY=your_brave_api_key_here`
- その他多数

これらを実際のAPIキーに置き換える必要があります。

---

## バックアップファイル作成日時

- 作成日: 2025-10-26
- バックアップ対象: API設定の重複整理とファイルクリーンアップ
- バックアップファイル名: `BACKUP_CLEANUP_2025-10-26.md`

---

## 注意事項

1. このバックアップファイルには**実際のAPIキー**が含まれています
2. **Gitにコミットする際は注意**してください（`.gitignore`に追加推奨）
3. 復元する際は、現在の`.env`ファイルを別途バックアップしてください
4. `.env.bak2`には**異なるGemini APIキー**が含まれていました
5. PPTXエクスポート機能は既に無効化されているため、復元しても動作しません

---

## このファイルの使い方

### 特定のファイルを復元する場合

1. 上記の該当セクションからコードをコピー
2. 元のファイルパスに貼り付け
3. 必要に応じて `src/mastra/index.ts` にインポートを追加

### すべてを復元する場合

「完全復元手順」セクションの手順に従ってください。

### 変更内容を確認する場合

「修正された設定」セクションで、削除された内容と復元方法を確認できます。

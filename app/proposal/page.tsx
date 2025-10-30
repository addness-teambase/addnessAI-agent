'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProposalGeneration } from '../hooks/useProposalGeneration';
import { Loader2, FileText, Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProposalGenerationPage() {
  const [yakusyoku, setYakusyoku] = useState<string>('');
  const [busyo, setBusyo] = useState<string>('');
  const [kadai, setKadai] = useState<string>('');

  const { messages, isLoading, generateProposal, reset } = useProposalGeneration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yakusyoku) return;

    generateProposal({
      yakusyoku,
      busyo,
      kadai,
    });
  };

  const handleReset = () => {
    reset();
    setYakusyoku('');
    setBusyo('');
    setKadai('');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">提案書自動生成</h1>
          </div>
          <p className="text-muted-foreground">
            課題をお聞かせいただければ、最適な提案書を自動生成します
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 入力フォーム */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                情報入力
              </CardTitle>
              <CardDescription>
                ご担当者様の情報と課題をご入力ください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 役職 */}
                <div className="space-y-2">
                  <Label htmlFor="yakusyoku" className="required">
                    役職 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={yakusyoku}
                    onValueChange={setYakusyoku}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="yakusyoku">
                      <SelectValue placeholder="役職を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="代表">代表</SelectItem>
                      <SelectItem value="管理職">管理職</SelectItem>
                      <SelectItem value="役職なし">役職なし</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 所属部署 */}
                <div className="space-y-2">
                  <Label htmlFor="busyo">所属部署</Label>
                  <Input
                    id="busyo"
                    type="text"
                    placeholder="例: 営業部、IT部門"
                    value={busyo}
                    onChange={(e) => setBusyo(e.target.value)}
                    disabled={isLoading}
                    maxLength={48}
                  />
                </div>

                {/* 実際の課題感 */}
                <div className="space-y-2">
                  <Label htmlFor="kadai">実際の課題感</Label>
                  <Textarea
                    id="kadai"
                    placeholder="現在抱えている課題や問題点を具体的にご記載ください&#10;&#10;例: &#10;- 業務の属人化が進んでおり、特定の担当者に依存している&#10;- データの管理が煩雑で、情報共有がスムーズにできない&#10;- 業務プロセスが非効率で、時間とコストがかかっている"
                    value={kadai}
                    onChange={(e) => setKadai(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[200px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    具体的な課題を記載いただくと、より精度の高い提案書が生成されます
                  </p>
                </div>

                {/* ボタン */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!yakusyoku || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        提案書を生成
                      </>
                    )}
                  </Button>
                  {messages.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      リセット
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 生成結果 */}
          <Card className="lg:max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                生成結果
              </CardTitle>
              <CardDescription>
                {messages.length === 0
                  ? '提案書がここに表示されます'
                  : 'AIが生成した提案書'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <FileText className="h-12 w-12 mx-auto opacity-50" />
                    <p>左側のフォームから情報を入力して、提案書を生成してください</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary/10 ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-2 text-muted-foreground">
                        {message.role === 'user' ? '入力内容' : 'AI生成'}
                      </div>
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {message.content}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 注意事項 */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                <p className="font-semibold">ご利用にあたっての注意事項：</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>生成された提案書は参考資料としてご利用ください</li>
                  <li>具体的な課題を記載いただくと、より精度の高い提案が生成されます</li>
                  <li>必要に応じて内容を編集・調整してご活用ください</li>
                  <li>機密情報の入力はお控えください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/app-sidebar';
import { MainHeader } from '@/app/components/MainHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Search,
  FileText,
  Bot,
  TrendingUp,
  Users,
  Award,
  Target,
  BarChart3,
  MessageSquare,
  AlertCircle,
  Star,
  FileBarChart,
  FileCheck,
  UserCheck,
  BookOpen,
  ShoppingCart,
  PackageSearch,
  RotateCcw,
  Factory,
  ShieldCheck,
  Wrench,
  X
} from 'lucide-react';

// エージェントの型定義
interface Agent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
}

// エージェント一覧データ
const agentsData: Agent[] = [
  // 営業・マーケティング系
  {
    id: 'proposal-generator',
    name: '提案資料自動生成',
    description: '企業情報入力→提案書作成',
    icon: FileText,
    category: '営業・マーケティング系'
  },
  {
    id: 'meeting-minutes',
    name: '商談議事録自動作成',
    description: '音声テキスト→議事録整形',
    icon: MessageSquare,
    category: '営業・マーケティング系'
  },
  {
    id: 'lead-scoring',
    name: 'リード優先順位付け',
    description: 'リスト入力→スコアリング',
    icon: Target,
    category: '営業・マーケティング系'
  },
  {
    id: 'sns-content',
    name: 'SNS投稿コンテンツ生成',
    description: 'テーマ入力→投稿文作成',
    icon: TrendingUp,
    category: '営業・マーケティング系'
  },
  {
    id: 'competitor-analysis',
    name: '競合分析レポート作成',
    description: '競合情報→分析レポート',
    icon: BarChart3,
    category: '営業・マーケティング系'
  },
  {
    id: 'quotation-generator',
    name: '見積書自動作成',
    description: '項目入力→見積書生成',
    icon: FileBarChart,
    category: '営業・マーケティング系'
  },
  // カスタマーサポート系
  {
    id: 'faq-auto-response',
    name: 'FAQ自動応答',
    description: '質問入力→回答生成',
    icon: MessageSquare,
    category: 'カスタマーサポート系'
  },
  {
    id: 'inquiry-routing',
    name: '問い合わせ自動振り分け',
    description: '内容→カテゴリ分類',
    icon: AlertCircle,
    category: 'カスタマーサポート系'
  },
  {
    id: 'complaint-priority',
    name: 'クレーム優先度判定',
    description: 'クレーム内容→緊急度判定',
    icon: AlertCircle,
    category: 'カスタマーサポート系'
  },
  {
    id: 'satisfaction-analysis',
    name: '顧客満足度分析',
    description: 'アンケート→分析レポート',
    icon: Star,
    category: 'カスタマーサポート系'
  },
  // 業務効率化系
  {
    id: 'sales-report',
    name: '営業日報自動集計',
    description: '日報データ→トレンド分析',
    icon: BarChart3,
    category: '業務効率化系'
  },
  {
    id: 'contract-review',
    name: '契約書レビュー支援',
    description: '契約書→リスクチェック',
    icon: FileCheck,
    category: '業務効率化系'
  },
  {
    id: 'applicant-screening',
    name: '採用応募者スクリーニング',
    description: '応募書類→評価レポート',
    icon: UserCheck,
    category: '業務効率化系'
  },
  {
    id: 'manual-generator',
    name: '作業手順書自動生成',
    description: '作業内容→マニュアル化',
    icon: BookOpen,
    category: '業務効率化系'
  },
  // EC・小売系
  {
    id: 'product-recommendation',
    name: '商品レコメンド生成',
    description: '顧客情報→おすすめ商品',
    icon: ShoppingCart,
    category: 'EC・小売系'
  },
  {
    id: 'review-analysis',
    name: 'レビュー分析・要約',
    description: 'レビューリスト→インサイト抽出',
    icon: PackageSearch,
    category: 'EC・小売系'
  },
  {
    id: 'return-analysis',
    name: '返品理由分析',
    description: '返品データ→傾向分析',
    icon: RotateCcw,
    category: 'EC・小売系'
  },
  // 製造・品質管理系
  {
    id: 'quality-inspection',
    name: '品質検査結果分析',
    description: '検査データ→問題点抽出',
    icon: ShieldCheck,
    category: '製造・品質管理系'
  },
  {
    id: 'defect-analysis',
    name: '不良品原因分析',
    description: '不良データ→原因特定',
    icon: AlertCircle,
    category: '製造・品質管理系'
  },
  {
    id: 'maintenance-planning',
    name: '設備保全計画作成',
    description: '設備情報→保全スケジュール',
    icon: Wrench,
    category: '製造・品質管理系'
  },
];

// カテゴリーごとの色定義
const categoryColors: Record<string, string> = {
  '営業・マーケティング系': 'bg-blue-100 text-blue-800 border-blue-200',
  'カスタマーサポート系': 'bg-green-100 text-green-800 border-green-200',
  '業務効率化系': 'bg-purple-100 text-purple-800 border-purple-200',
  'EC・小売系': 'bg-orange-100 text-orange-800 border-orange-200',
  '製造・品質管理系': 'bg-red-100 text-red-800 border-red-200',
};

// 検索機能
function searchAgents(agents: Agent[], searchQuery: string) {
  if (!searchQuery.trim()) {
    return agents;
  }

  const query = searchQuery.toLowerCase();

  return agents.filter(agent => {
    const nameMatch = agent.name.toLowerCase().includes(query);
    const descriptionMatch = agent.description.toLowerCase().includes(query);
    const categoryMatch = agent.category.toLowerCase().includes(query);

    return nameMatch || descriptionMatch || categoryMatch;
  });
}

// カテゴリーでグループ化
function groupByCategory(agents: Agent[]): Record<string, Agent[]> {
  return agents.reduce((acc, agent) => {
    if (!acc[agent.category]) {
      acc[agent.category] = [];
    }
    acc[agent.category].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);
}

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

function AgentCard({ agent, onClick }: AgentCardProps) {
  const AgentIcon = agent.icon;

  return (
    <Card 
      className="flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
            <AgentIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold leading-tight mb-2">{agent.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{agent.description}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${categoryColors[agent.category]} w-fit text-xs`}
        >
          {agent.category}
        </Badge>
      </CardHeader>
    </Card>
  );
}

export default function AgentsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  // 検索クエリの状態管理
  const [searchQuery, setSearchQuery] = React.useState('');

  // 検索フィルターを適用
  const filteredAgents = React.useMemo(() => {
    return searchAgents(agentsData, searchQuery);
  }, [searchQuery]);

  // カテゴリーでグループ化
  const groupedAgents = React.useMemo(() => {
    return groupByCategory(filteredAgents);
  }, [filteredAgents]);

  // 検索クリア機能
  const clearSearch = () => {
    setSearchQuery('');
  };

  // エージェントカードクリック時の処理
  const handleAgentClick = (agentId: string) => {
    if (agentId === 'faq-auto-response') {
      // FAQ自動応答の場合はメインチャット画面に遷移
      router.push(`/?mode=${agentId}`);
    }
    // 他のエージェントは今後実装
  };

  return (
    <SidebarProvider>
      {isMobile ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <AppSidebar className="hidden md:block" />
      )}
      <SidebarInset className="flex flex-col h-full">
        <MainHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="min-h-screen bg-background flex justify-start">
          <div className="w-full pl-12 md:pl-32 lg:pl-48 xl:pl-64 pr-8 md:pr-16 lg:pr-20 xl:pr-24 py-16 max-w-[1600px]">
            {/* ヘッダー */}
            <div className="mb-16">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                アドネスAIエージェント一覧
              </h1>
              <p className="text-muted-foreground text-base">
                ビジネスを加速する20種類のAIエージェント
              </p>
            </div>

            {/* 検索セクション */}
            <Card className="mb-16 border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  エージェント検索
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="エージェント名、説明、カテゴリーで検索..."
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* エージェント一覧 */}
            <div className="space-y-16">
              {Object.keys(groupedAgents).length > 0 ? (
                Object.entries(groupedAgents).map(([category, agents]) => (
                  <div key={category}>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        {category}
                      </h2>
                      <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded mt-2"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {agents.map(agent => (
                        <AgentCard 
                          key={agent.id} 
                          agent={agent}
                          onClick={() => handleAgentClick(agent.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">一致するエージェントが見つかりませんでした。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>

    </SidebarProvider>
  );
} 
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { MainHeader } from '@/app/components/MainHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Bot,
  FolderTree,
  AlertCircle,
  Star,
  Calendar,
  FileCheck,
  Users,
  BookOpen,
  ShoppingCart,
  MessageCircle,
  Package,
  Shield,
  Info,
  Wrench,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type AgentCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  agents: Agent[];
};

type Agent = {
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  link: string;
};

const agentCategories: AgentCategory[] = [
  {
    id: 'sales-marketing',
    name: '営業・マーケティング系',
    icon: <BarChart3 className="w-5 h-5" />,
    agents: [
      {
        name: '提案資料自動生成',
        description: '企業情報入力→提案書作成',
        icon: <FileText className="w-6 h-6 text-blue-600" />,
        category: '営業・マーケティング系',
        link: '/?mode=proposal-generator',
      },
      {
        name: '商談議事録自動作成',
        description: '音声テキスト→議事録整形',
        icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
        category: '営業・マーケティング系',
        link: '/?mode=meeting-minutes',
      },
      {
        name: 'リード優先順位付け',
        description: 'リスト入力→スコアリング',
        icon: <Target className="w-6 h-6 text-blue-600" />,
        category: '営業・マーケティング系',
        link: '/?mode=lead-scoring',
      },
      {
        name: 'SNS投稿コンテンツ生成',
        description: 'テーマ入力→投稿文作成',
        icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
        category: '営業・マーケティング系',
        link: '/?mode=sns-content',
      },
      {
        name: '競合分析レポート作成',
        description: '競合情報→分析レポート',
        icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
        category: '営業・マーケティング系',
        link: '/?mode=competitor-analysis',
      },
      {
        name: '見積書自動作成',
        description: '項目入力→見積書生成',
        icon: <FileSpreadsheet className="w-6 h-6 text-blue-600" />,
        category: '営業・マーケティング系',
        link: '/?mode=quotation-generator',
      },
    ],
  },
  {
    id: 'customer-support',
    name: 'カスタマーサポート系',
    icon: <Bot className="w-5 h-5" />,
    agents: [
      {
        name: 'FAQ自動応答',
        description: '質問入力→回答生成',
        icon: <MessageSquare className="w-6 h-6 text-green-600" />,
        category: 'カスタマーサポート系',
        link: '/?mode=faq-auto-response',
      },
      {
        name: '問い合わせ自動振り分け',
        description: '内容→カテゴリ分類',
        icon: <FolderTree className="w-6 h-6 text-green-600" />,
        category: 'カスタマーサポート系',
        link: '/?mode=inquiry-routing',
      },
      {
        name: 'クレーム優先度判定',
        description: 'クレーム内容→緊急度判定',
        icon: <AlertCircle className="w-6 h-6 text-green-600" />,
        category: 'カスタマーサポート系',
        link: '/?mode=complaint-priority',
      },
      {
        name: '顧客満足度分析',
        description: 'アンケート→分析レポート',
        icon: <Star className="w-6 h-6 text-green-600" />,
        category: 'カスタマーサポート系',
        link: '/?mode=satisfaction-analysis',
      },
    ],
  },
  {
    id: 'business-efficiency',
    name: '業務効率化系',
    icon: <Calendar className="w-5 h-5" />,
    agents: [
      {
        name: '営業日報自動集計',
        description: '日報データ→トレンド分析',
        icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
        category: '業務効率化系',
        link: '/?mode=sales-report',
      },
      {
        name: '契約書レビュー支援',
        description: '契約書→リスクチェック',
        icon: <FileCheck className="w-6 h-6 text-purple-600" />,
        category: '業務効率化系',
        link: '/?mode=contract-review',
      },
      {
        name: '採用応募者スクリーニング',
        description: '応募書類→評価レポート',
        icon: <Users className="w-6 h-6 text-purple-600" />,
        category: '業務効率化系',
        link: '/?mode=candidate-screening',
      },
      {
        name: '作業手順書自動生成',
        description: '作業内容→マニュアル化',
        icon: <BookOpen className="w-6 h-6 text-purple-600" />,
        category: '業務効率化系',
        link: '/?mode=procedure-manual',
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'EC・小売系',
    icon: <ShoppingCart className="w-5 h-5" />,
    agents: [
      {
        name: '商品レコメンド生成',
        description: '顧客情報→おすすめ商品',
        icon: <ShoppingCart className="w-6 h-6 text-orange-600" />,
        category: 'EC・小売系',
        link: '/?mode=product-recommendation',
      },
      {
        name: 'レビュー分析・要約',
        description: 'レビューリスト→インサイト抽出',
        icon: <MessageCircle className="w-6 h-6 text-orange-600" />,
        category: 'EC・小売系',
        link: '/?mode=review-analysis',
      },
      {
        name: '返品理由分析',
        description: '返品データ→傾向分析',
        icon: <Package className="w-6 h-6 text-orange-600" />,
        category: 'EC・小売系',
        link: '/?mode=return-analysis',
      },
    ],
  },
  {
    id: 'manufacturing',
    name: '製造・品質管理系',
    icon: <Shield className="w-5 h-5" />,
    agents: [
      {
        name: '品質検査結果分析',
        description: '検査データ→問題点抽出',
        icon: <Shield className="w-6 h-6 text-red-600" />,
        category: '製造・品質管理系',
        link: '/?mode=quality-inspection',
      },
      {
        name: '不良品原因分析',
        description: '不良データ→原因特定',
        icon: <Info className="w-6 h-6 text-red-600" />,
        category: '製造・品質管理系',
        link: '/?mode=defect-analysis',
      },
      {
        name: '設備保全計画作成',
        description: '設備情報→保全スケジュール',
        icon: <Wrench className="w-6 h-6 text-red-600" />,
        category: '製造・品質管理系',
        link: '/?mode=maintenance-plan',
      },
    ],
  },
];

export default function AgentsPage() {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleCardClick = (link: string) => {
    if (link.includes('mode=faq-auto-response')) {
      router.push(link);
      // FAQモードの場合はリロードして状態をリセット
      setTimeout(() => window.location.reload(), 100);
    } else {
      router.push(link);
    }
  };

  // 検索フィルター
  const filteredCategories = agentCategories.map(category => ({
    ...category,
    agents: category.agents.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.agents.length > 0);

  // カテゴリ別のバッジカラー
  const getCategoryBadgeColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      'sales-marketing': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'customer-support': 'bg-green-100 text-green-700 hover:bg-green-200',
      'business-efficiency': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'ecommerce': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'manufacturing': 'bg-red-100 text-red-700 hover:bg-red-200',
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <SidebarProvider className="h-screen">
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
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <div className="w-full flex-1 flex flex-col overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-6">
              {/* ヘッダー */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">アドネスAIエージェント一覧</h1>
                <p className="text-gray-600 mt-2">ビジネスを加速する20種類のAIエージェント</p>
              </div>

              {/* 検索バー */}
              <div className="mb-8 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="エージェント名、部門、カテゴリーで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-6 text-base"
                  />
                </div>
              </div>

              {/* カテゴリ別エージェント一覧 */}
              <div className="space-y-10">
                {filteredCategories.map((category) => (
                  <div key={category.id}>
                    {/* カテゴリヘッダー */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${getCategoryBadgeColor(category.id)}`}>
                        {category.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
                    </div>

                    {/* エージェントカード */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {category.agents.map((agent) => (
                        <Card
                          key={agent.name}
                          className="flex flex-col hover:shadow-xl transition-all duration-200 cursor-pointer border-2 hover:border-blue-500 bg-white"
                          onClick={() => handleCardClick(agent.link)}
                        >
                          <CardHeader className="space-y-3 pb-3">
                            <div className="flex items-center justify-between">
                              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                {agent.icon}
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold leading-tight mb-2">
                                {agent.name}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600">
                                {agent.description}
                              </CardDescription>
                            </div>
                          </CardHeader>
                          <CardFooter className="pt-0 mt-auto">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getCategoryBadgeColor(category.id)}`}
                            >
                              {agent.category}
                            </Badge>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                {/* 検索結果なし */}
                {filteredCategories.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">該当するエージェントが見つかりませんでした</p>
                    <p className="text-gray-400 text-sm mt-2">検索条件を変更してお試しください</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

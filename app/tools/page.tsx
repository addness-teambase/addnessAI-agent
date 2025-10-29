'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Search,
  Home,
  Menu,
  Sparkles,
  ArrowRight,
  PanelLeft,
  X
} from 'lucide-react';

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
    id: 'data-analysis',
    name: 'データ分析系',
    icon: <BarChart3 className="w-5 h-5" />,
    agents: [
      {
        name: 'PDF分析',
        description: 'PDF→詳細分析レポート',
        icon: <FileText className="w-6 h-6 text-red-600" />,
        category: 'データ分析系',
        link: '/?mode=pdf-analysis',
      },
      {
        name: 'Excel分析',
        description: 'Excel/CSV→データ分析',
        icon: <FileSpreadsheet className="w-6 h-6 text-green-600" />,
        category: 'データ分析系',
        link: '/?mode=excel-analysis',
      },
    ],
  },
];

export default function ToolsPage() {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleCardClick = (link: string) => {
    if (link.includes('mode=faq-auto-response') || link.includes('mode=contract-review')) {
      router.push(link);
      // Difyモード（FAQ、契約書レビュー）の場合はリロードして状態をリセット
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
      'data-analysis': 'bg-amber-100 text-amber-700 hover:bg-amber-200',
      'ecommerce': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'manufacturing': 'bg-red-100 text-red-700 hover:bg-red-200',
    };
    return colors[categoryId] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Sidebar */}
      <div className={`${isMobile ? 'hidden' : sidebarOpen ? 'block' : 'hidden'} fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl z-40 transition-all duration-300`}>
        <div className="h-full flex flex-col">
          {/* Logo & Brand */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Addness AI Agent</h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
            >
              <Home className="w-5 h-5 group-hover:text-blue-600" />
              <span className="font-medium">チャット</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-medium">
              <Users className="w-5 h-5" />
              <span>エージェント一覧</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">AIエージェント</p>
                <p className="text-xs text-slate-500">ai@addness.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <div className="h-full bg-white/95 backdrop-blur-xl">
              {/* Same content as desktop sidebar */}
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">Addness AI Agent</h1>
                    </div>
                  </div>
                </div>
                <div className="flex-1 px-4 py-6 space-y-2">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">チャット</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-medium">
                    <Users className="w-5 h-5" />
                    <span>エージェント一覧</span>
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">エージェント一覧</span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-4 z-50 p-2 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${sidebarOpen ? 'left-[280px]' : 'left-4'}`}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-slate-600" />
          ) : (
            <PanelLeft className="w-5 h-5 text-slate-600" />
          )}
        </button>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? 'pt-0' : sidebarOpen ? 'pl-72' : 'pl-0'} min-h-screen transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>22種類のAIエージェント</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-[1.2] pb-1">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent inline-block py-1">
                Addness AI Agent
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ビジネスを加速する次世代AIエージェント。作業効率を劇的に向上させる革新的なソリューション。
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="エージェント名、部門、カテゴリーで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-base border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-lg focus:border-blue-300 transition-all duration-200"
              />
            </div>
          </div>

          {/* Agent Categories */}
          <div className="space-y-16">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl shadow-lg ${getCategoryBadgeColor(category.id)} border border-white/20`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                    <p className="text-slate-600">効率的なワークフローを実現</p>
                  </div>
                </div>

                {/* Agent Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.agents.map((agent) => (
                    <Card
                      key={agent.name}
                      className="group relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-[1.02]"
                      onClick={() => handleCardClick(agent.link)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                      <CardHeader className="pb-4 relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-sm">
                            {agent.icon}
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                          {agent.name}
                        </CardTitle>
                        <CardDescription className="text-slate-600 text-sm leading-relaxed">
                          {agent.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <Badge
                          variant="secondary"
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryBadgeColor(category.id)} border-0`}
                        >
                          {agent.category}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* No Results */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-20">
                <div className="p-6 bg-slate-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">該当するエージェントが見つかりませんでした</h3>
                <p className="text-slate-600">検索条件を変更してお試しください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
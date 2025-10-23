"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import {
  ArrowUpCircle,
  ClipboardList,
  MessageSquare,
  Bot,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "AI Agent",
    email: "ai@presentation.com",
    avatar: "/avatars/ai-agent.jpg",
  },
  navMain: [
    {
      title: "チャット",
      url: "/",
      icon: MessageSquare,
    },
    {
      title: "エージェント一覧",
      url: "/tools",
      icon: ClipboardList,
    },
  ],
}

// useSearchParams()を使用する内部コンポーネント
function AppSidebarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams?.get('mode')
  const isFAQMode = mode === 'faq-auto-response'

  const handleFAQClick = () => {
    // 会話をリセットして再表示（ページをリロード）
    router.push('/?mode=faq-auto-response')
    window.location.reload()
  }

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <ArrowUpCircle className="h-5 w-5" />
                <span className="text-base font-semibold">アドネスAIエージェント</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        
        {/* FAQモード時のみ表示 */}
        {isFAQMode && (
          <>
            <SidebarSeparator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel>アクティブなエージェント</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleFAQClick} isActive={true}>
                      <Bot className="h-4 w-4" />
                      <span>FAQ自動応答</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator className="my-2" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <Suspense fallback={
        <>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                  <a href="/">
                    <ArrowUpCircle className="h-5 w-5" />
                    <span className="text-base font-semibold">アドネスAIエージェント</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </>
      }>
        <AppSidebarContent />
      </Suspense>
    </Sidebar>
  )
} 
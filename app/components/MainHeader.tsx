'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModelSelector } from './ModelSelector';

interface MainHeaderProps {
  onMenuClick?: () => void;
}

export const MainHeader = ({ onMenuClick }: MainHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white sticky top-0 z-40 w-full border-b">
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Left side: Sidebar Toggle */}
        <div className="flex items-center w-10">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onMenuClick}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          ) : (
            <SidebarTrigger className="mr-2" />
          )}
        </div>

        {/* Center: Model selector */}
        <div className="flex-1 flex justify-center">
          <ModelSelector />
        </div>

        {/* Right side spacer */}
        <div className="flex items-center w-10"></div>
      </div>
    </header>
  );
}; 
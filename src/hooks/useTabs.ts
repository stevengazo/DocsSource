// src/hooks/useTabs.ts
import { useState, useCallback } from 'react';

export type TabKey = string;

interface UseTabsProps<T extends TabKey> {
  initialTab: T;
  tabs: T[];
}

export function useTabs<T extends TabKey>({ initialTab, tabs }: UseTabsProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  // Cambiar de tab
  const selectTab = useCallback((tab: T) => {
    if (tabs.includes(tab)) setActiveTab(tab);
  }, [tabs]);

  // Clases para el texto de cada tab según estado
  const getTabTextClass = (tab: T, theme: 'dark' | 'light') => {
    const isActive = tab === activeTab;
    if (isActive) return theme === 'dark' ? 'text-white' : 'text-gray-900';
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  };

  return {
    activeTab,
    selectTab,
    getTabTextClass,
  };
}
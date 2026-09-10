import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { initialTabs, type Tab } from '../../../mockData';

const STORAGE_KEY = 'tabsOrder';

function isStoredTab(value: unknown): value is Tab {
  if (typeof value !== 'object' || value === null) return false;

  const tab = value as Record<string, unknown>;

  return (
    typeof tab.id === 'string' &&
    typeof tab.title === 'string' &&
    typeof tab.url === 'string' &&
    typeof tab.icon === 'string' &&
    typeof tab.isPinned === 'boolean'
  );
}

export interface PersistedTabsState {
  tabs: Tab[];
  setTabs: Dispatch<SetStateAction<Tab[]>>;
}

export function usePersistedTabs(): PersistedTabsState {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedTabs = localStorage.getItem(STORAGE_KEY);

    if (savedTabs) {
      try {
        const parsedTabs: unknown = JSON.parse(savedTabs);

        if (Array.isArray(parsedTabs) && parsedTabs.every(isStoredTab)) {
          if (parsedTabs.length === initialTabs.length) {
            setTabs(parsedTabs);
            setIsHydrated(true);
            return;
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTabs));
          setTabs(initialTabs);
          setIsHydrated(true);
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setTabs(initialTabs);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    }
  }, [isHydrated, tabs]);

  return { tabs, setTabs };
}

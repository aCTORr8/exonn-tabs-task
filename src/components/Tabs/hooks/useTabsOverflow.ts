import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Tab } from '../../../mockData';

export interface UseTabsOverflowOptions {
  pinnedTabs: Tab[];
  regularTabs: Tab[];
  reservedWidth: number;
  gap?: number;
}

export function useTabsOverflow({
  pinnedTabs,
  regularTabs,
  reservedWidth,
  gap = 0,
}: UseTabsOverflowOptions) {
  const [visibleTabsCount, setVisibleTabsCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredTabsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const visibleTabs = useMemo(
    () => regularTabs.slice(0, visibleTabsCount),
    [regularTabs, visibleTabsCount],
  );
  const hiddenTabs = useMemo(
    () => regularTabs.slice(visibleTabsCount),
    [regularTabs, visibleTabsCount],
  );

  const setMeasuredTabRef = useCallback(
    (tabId: string, element: HTMLDivElement | null) => {
      if (element) {
        measuredTabsRef.current.set(tabId, element);
      } else {
        measuredTabsRef.current.delete(tabId);
      }
    },
    [],
  );

  const calculateVisibleTabs = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const getTabWidth = (tab: Tab) =>
      measuredTabsRef.current.get(tab.id)?.getBoundingClientRect().width ?? 0;
    const pinnedWidth = pinnedTabs.reduce(
      (total, tab) => total + getTabWidth(tab),
      0,
    );

    const getRequiredWidth = (regularCount: number) => {
      const regularWidth = regularTabs
        .slice(0, regularCount)
        .reduce((total, tab) => total + getTabWidth(tab), 0);
      const itemCount = pinnedTabs.length + regularCount + 1;

      return (
        pinnedWidth +
        regularWidth +
        reservedWidth +
        Math.max(0, itemCount - 1) * gap
      );
    };

    if (getRequiredWidth(regularTabs.length) <= containerWidth) {
      setVisibleTabsCount(regularTabs.length);
      return;
    }

    let nextVisibleCount = 0;

    while (
      nextVisibleCount < regularTabs.length &&
      getRequiredWidth(nextVisibleCount + 1) <= containerWidth
    ) {
      nextVisibleCount += 1;
    }

    setVisibleTabsCount(nextVisibleCount);
  }, [gap, pinnedTabs, regularTabs, reservedWidth]);

  useLayoutEffect(() => {
    calculateVisibleTabs();
  }, [calculateVisibleTabs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', calculateVisibleTabs);
      return () => window.removeEventListener('resize', calculateVisibleTabs);
    }

    const observer = new ResizeObserver(calculateVisibleTabs);
    observer.observe(container);

    return () => observer.disconnect();
  }, [calculateVisibleTabs]);

  return {
    containerRef,
    visibleTabs,
    hiddenTabs,
    setMeasuredTabRef,
  };
}

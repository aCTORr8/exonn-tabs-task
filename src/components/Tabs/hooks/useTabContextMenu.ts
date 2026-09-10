import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type RefObject,
} from 'react';
import type { Tab } from '../../../mockData';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  tabId: string | null;
}

const CLOSED_CONTEXT_MENU: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  tabId: null,
};

export function useTabContextMenu(
  tabs: Tab[],
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const [contextMenu, setContextMenu] =
    useState<ContextMenuState>(CLOSED_CONTEXT_MENU);

  const closeContextMenu = useCallback(() => {
    setContextMenu(CLOSED_CONTEXT_MENU);
  }, []);

  const openContextMenu = useCallback(
    (event: MouseEvent<HTMLDivElement>, tabId: string) => {
      event.preventDefault();

      const containerBounds = containerRef.current?.getBoundingClientRect();

      setContextMenu({
        visible: true,
        x: event.clientX - (containerBounds?.left ?? 0),
        y: event.clientY - (containerBounds?.top ?? 0),
        tabId,
      });
    },
    [containerRef],
  );

  useEffect(() => {
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, [closeContextMenu]);

  const contextMenuTab = useMemo(
    () => tabs.find((tab) => tab.id === contextMenu.tabId) ?? null,
    [contextMenu.tabId, tabs],
  );

  return { contextMenu, contextMenuTab, openContextMenu, closeContextMenu };
}

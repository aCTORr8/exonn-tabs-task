import type { MouseEvent } from 'react';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Tab } from '../../../mockData';
import { PinnedTabItem } from './PinnedTabItem';
import { TabItem } from './TabItem';

export interface TabsListProps {
  pinnedTabs: Tab[];
  visibleTabs: Tab[];
  activePath: string;
  onOpenTab: (tab: Tab) => void;
  onCloseTab: (tabId: string) => void;
  onContextMenu: (event: MouseEvent<HTMLDivElement>, tabId: string) => void;
}

export function TabsList({
  pinnedTabs,
  visibleTabs,
  activePath,
  onOpenTab,
  onCloseTab,
  onContextMenu,
}: TabsListProps) {
  return (
    <>
      <SortableContext
        items={pinnedTabs.map((tab) => tab.id)}
        strategy={horizontalListSortingStrategy}
      >
        {pinnedTabs.map((tab) => (
          <PinnedTabItem
            key={tab.id}
            tab={tab}
            isActive={activePath === tab.url}
            onClick={() => onOpenTab(tab)}
            onContextMenu={(event) => onContextMenu(event, tab.id)}
          />
        ))}
      </SortableContext>

      <div className="tabs-visible-list">
        <SortableContext
          items={visibleTabs.map((tab) => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {visibleTabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={activePath === tab.url}
              onClick={() => onOpenTab(tab)}
              onClose={() => onCloseTab(tab.id)}
              onContextMenu={(event) => onContextMenu(event, tab.id)}
            />
          ))}
        </SortableContext>
      </div>
    </>
  );
}

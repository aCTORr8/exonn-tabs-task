import type { MouseEvent } from 'react';
import type { Tab } from '../../../mockData';
import { getTabIcon } from '../utils/tabIcons';
import { SortableTab } from './SortableTab';
import '../styles/TabItem.css';
import '../styles/PinnedTabItem.css';

export interface PinnedTabContentProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
}

export function PinnedTabContent({
  tab,
  isActive,
  onClick,
  onContextMenu,
}: PinnedTabContentProps) {
  const Icon = getTabIcon(tab.icon);
  const className = [
    'tab-item',
    'tab-item--pinned',
    isActive && 'tab-item--active active',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} onContextMenu={onContextMenu}>
      <button
        type="button"
        className="tab-main-button"
        aria-current={isActive ? 'page' : undefined}
        aria-label={tab.title}
        onClick={onClick}
      >
        <Icon className="tab-icon" size={16} aria-hidden="true" />
      </button>

      <div className="custom-tooltip" role="tooltip">
        <Icon size={16} aria-hidden="true" />
        <span>{tab.title}</span>
      </div>
    </div>
  );
}

export type PinnedTabItemProps = PinnedTabContentProps;

export function PinnedTabItem(props: PinnedTabItemProps) {
  return (
    <SortableTab id={props.tab.id}>
      <PinnedTabContent {...props} />
    </SortableTab>
  );
}

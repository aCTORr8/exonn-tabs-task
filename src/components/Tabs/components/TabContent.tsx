import type { MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { Tab } from '../../../mockData';
import { getTabIcon } from '../utils/tabIcons';
import '../styles/TabItem.css';

export interface TabContentProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose?: () => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
  isDropdownItem?: boolean;
}

export function TabContent({
  tab,
  isActive,
  onClick,
  onClose,
  onContextMenu,
  isDropdownItem = false,
}: TabContentProps) {
  const Icon = getTabIcon(tab.icon);
  const className = [
    'tab-item',
    isActive && 'tab-item--active active',
    isDropdownItem && 'tab-item--dropdown',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} onContextMenu={onContextMenu}>
      <button
        type="button"
        className="tab-main-button"
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
      >
        <Icon className="tab-icon" size={16} aria-hidden="true" />
        <span className="tab-title">{tab.title}</span>
      </button>

      {onClose && (
        <button
          type="button"
          className="tab-action-button tab-close-button close-btn"
          aria-label={`Close ${tab.title}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

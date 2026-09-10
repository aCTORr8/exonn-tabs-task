import type { MouseEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Tab } from '../../../mockData';
import { TabContent } from './TabContent';
import '../styles/OverflowDropdown.css';

export interface OverflowDropdownProps {
  hiddenTabs: Tab[];
  isOpen: boolean;
  activePath: string;
  onToggle: () => void;
  onOpenTab: (tab: Tab) => void;
  onCloseTab: (tabId: string) => void;
  onContextMenu: (event: MouseEvent<HTMLDivElement>, tabId: string) => void;
}

export function OverflowDropdown({
  hiddenTabs,
  isOpen,
  activePath,
  onToggle,
  onOpenTab,
  onCloseTab,
  onContextMenu,
}: OverflowDropdownProps) {
  const hasHiddenTabs = hiddenTabs.length > 0;

  return (
    <div className="tabs-overflow">
      <button
        type="button"
        className="tabs-overflow-button"
        aria-label={isOpen ? 'Hide tabs' : 'Show hidden tabs'}
        aria-expanded={isOpen}
        aria-disabled={!hasHiddenTabs}
        onClick={() => {
          if (hasHiddenTabs) onToggle();
        }}
      >
        {isOpen ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>

      {isOpen && hasHiddenTabs && (
        <div role="menu" className="tabs-dropdown">
          {hiddenTabs.map((tab) => (
            <TabContent
              key={tab.id}
              tab={tab}
              isActive={activePath === tab.url}
              onClick={() => onOpenTab(tab)}
              onClose={() => onCloseTab(tab.id)}
              onContextMenu={(event) => onContextMenu(event, tab.id)}
              isDropdownItem
            />
          ))}
        </div>
      )}
    </div>
  );
}

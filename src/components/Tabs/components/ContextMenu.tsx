import { Pin } from 'lucide-react';
import type { Tab } from '../../../mockData';
import '../styles/ContextMenu.css';

export interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  tab: Tab | null;
  onTogglePin: (tabId: string) => void;
  onClose: () => void;
}

export function ContextMenu({
  visible,
  x,
  y,
  tab,
  onTogglePin,
  onClose,
}: ContextMenuProps) {
  if (!visible || !tab) return null;

  return (
    <div
      className="tab-context-menu"
      role="menu"
      style={{ left: x, top: y }}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="tab-context-menu-item"
        role="menuitem"
        onClick={() => {
          onTogglePin(tab.id);
          onClose();
        }}
      >
        <Pin size={16} aria-hidden="true" />
        <span>{tab.isPinned ? 'Unpin' : 'Tab anpinnen'}</span>
      </button>
    </div>
  );
}

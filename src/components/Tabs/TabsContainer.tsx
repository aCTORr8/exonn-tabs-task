import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useLocation } from 'react-router-dom';
import { ContextMenu } from './components/ContextMenu';
import { OverflowDropdown } from './components/OverflowDropdown';
import { TabsList } from './components/TabsList';
import { TabsMeasurementLayer } from './components/TabsMeasurementLayer';
import { usePersistedTabs } from './hooks/usePersistedTabs';
import { useTabActions } from './hooks/useTabActions';
import { useTabContextMenu } from './hooks/useTabContextMenu';
import { useTabsDnd } from './hooks/useTabsDnd';
import { useTabsOverflow } from './hooks/useTabsOverflow';
import './styles/TabsContainer.css';

const OVERFLOW_TRIGGER_WIDTH = 40;

export function TabsContainer() {
  const { tabs, setTabs } = usePersistedTabs();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const pinnedTabs = useMemo(
    () => tabs.filter((tab) => tab.isPinned),
    [tabs],
  );
  const regularTabs = useMemo(
    () => tabs.filter((tab) => !tab.isPinned),
    [tabs],
  );
  const {
    containerRef,
    visibleTabs,
    hiddenTabs,
    setMeasuredTabRef,
  } = useTabsOverflow({
    pinnedTabs,
    regularTabs,
    reservedWidth: OVERFLOW_TRIGGER_WIDTH,
  });

  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
  const { openTab, closeTab, togglePin } = useTabActions({
    setTabs,
    closeDropdown,
  });
  const {
    contextMenu,
    contextMenuTab,
    openContextMenu,
    closeContextMenu,
  } = useTabContextMenu(tabs, containerRef);
  const { sensors, handleDragEnd } = useTabsDnd({
    pinnedTabs,
    regularTabs,
    setTabs,
  });

  useEffect(() => {
    if (hiddenTabs.length === 0) closeDropdown();
  }, [closeDropdown, hiddenTabs.length]);

  return (
    <div ref={containerRef} className="tabs-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <TabsList
          pinnedTabs={pinnedTabs}
          visibleTabs={visibleTabs}
          activePath={location.pathname}
          onOpenTab={openTab}
          onCloseTab={closeTab}
          onContextMenu={openContextMenu}
        />
      </DndContext>

      <OverflowDropdown
        hiddenTabs={hiddenTabs}
        isOpen={isDropdownOpen}
        activePath={location.pathname}
        onToggle={() => setIsDropdownOpen((isOpen) => !isOpen)}
        onOpenTab={openTab}
        onCloseTab={closeTab}
        onContextMenu={openContextMenu}
      />

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        tab={contextMenuTab}
        onTogglePin={togglePin}
        onClose={closeContextMenu}
      />

      <TabsMeasurementLayer
        pinnedTabs={pinnedTabs}
        regularTabs={regularTabs}
        setMeasuredTabRef={setMeasuredTabRef}
      />
    </div>
  );
}

export default TabsContainer;

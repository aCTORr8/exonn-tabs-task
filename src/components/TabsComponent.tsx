import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initialTabs, type Tab } from '../mockData';

const STORAGE_KEY = 'tabsOrder';
const TABS_GAP = 8;
const OVERFLOW_BUTTON_WIDTH = 32;

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose?: () => void;
}

function TabButton({ tab, isActive, onClick, onClose }: TabButtonProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      <button
        type="button"
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
      >
        {tab.title}
      </button>

      {onClose && (
        <button
          type="button"
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

function SortableTab({ tab, isActive, onClick, onClose }: TabButtonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <TabButton
        tab={tab}
        isActive={isActive}
        onClick={onClick}
        onClose={onClose}
      />
    </div>
  );
}

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

export function TabsComponent() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [visibleTabsCount, setVisibleTabsCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const measuredTabsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const navigate = useNavigate();
  const location = useLocation();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const savedTabs = localStorage.getItem(STORAGE_KEY);

    if (savedTabs) {
      try {
        const parsedTabs: unknown = JSON.parse(savedTabs);

        if (
          Array.isArray(parsedTabs) &&
          parsedTabs.length > 0 &&
          parsedTabs.every(isStoredTab)
        ) {
          setTabs(parsedTabs);
          setIsHydrated(true);
          return;
        }
      } catch {
        // Ignore invalid stored data and restore the default tabs.
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

  const pinnedTabs = useMemo(
    () => tabs.filter((tab) => tab.isPinned),
    [tabs],
  );
  const sortableTabs = useMemo(
    () => tabs.filter((tab) => !tab.isPinned),
    [tabs],
  );
  const visibleTabs = useMemo(
    () => sortableTabs.slice(0, visibleTabsCount),
    [sortableTabs, visibleTabsCount],
  );
  const hiddenTabs = useMemo(
    () => sortableTabs.slice(visibleTabsCount),
    [sortableTabs, visibleTabsCount],
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
    const containerWidth = tabsContainerRef.current?.clientWidth ?? 0;
    const getTabWidth = (tab: Tab) =>
      measuredTabsRef.current.get(tab.id)?.getBoundingClientRect().width ?? 0;
    const pinnedWidth = pinnedTabs.reduce(
      (total, tab) => total + getTabWidth(tab),
      0,
    );

    const getRequiredWidth = (sortableCount: number, withOverflow: boolean) => {
      const sortableWidth = sortableTabs
        .slice(0, sortableCount)
        .reduce((total, tab) => total + getTabWidth(tab), 0);
      const itemCount = pinnedTabs.length + sortableCount + (withOverflow ? 1 : 0);

      return (
        pinnedWidth +
        sortableWidth +
        (withOverflow ? OVERFLOW_BUTTON_WIDTH : 0) +
        Math.max(0, itemCount - 1) * TABS_GAP
      );
    };

    if (getRequiredWidth(sortableTabs.length, false) <= containerWidth) {
      setVisibleTabsCount(sortableTabs.length);
      return;
    }

    let nextVisibleCount = 0;

    while (
      nextVisibleCount < sortableTabs.length &&
      getRequiredWidth(nextVisibleCount + 1, true) <= containerWidth
    ) {
      nextVisibleCount += 1;
    }

    setVisibleTabsCount(nextVisibleCount);
  }, [pinnedTabs, sortableTabs]);

  useLayoutEffect(() => {
    calculateVisibleTabs();
  }, [calculateVisibleTabs]);

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', calculateVisibleTabs);
      return () => window.removeEventListener('resize', calculateVisibleTabs);
    }

    const observer = new ResizeObserver(calculateVisibleTabs);
    observer.observe(container);

    return () => observer.disconnect();
  }, [calculateVisibleTabs]);

  useEffect(() => {
    if (hiddenTabs.length === 0) {
      setIsDropdownOpen(false);
    }
  }, [hiddenTabs.length]);

  const openTab = (tab: Tab) => {
    navigate(tab.url);
    setIsDropdownOpen(false);
  };

  const closeTab = (tabId: string) => {
    setTabs((currentTabs) => currentTabs.filter((tab) => tab.id !== tabId));
    setIsDropdownOpen(false);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = visibleTabs.findIndex((tab) => tab.id === active.id);
    const newIndex = visibleTabs.findIndex((tab) => tab.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedVisibleTabs = arrayMove(visibleTabs, oldIndex, newIndex);
    setTabs([...pinnedTabs, ...reorderedVisibleTabs, ...hiddenTabs]);
  };

  return (
    <div
      ref={tabsContainerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: TABS_GAP,
        width: '100%',
      }}
    >
      {pinnedTabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={location.pathname === tab.url}
          onClick={() => openTab(tab)}
        />
      ))}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleTabs.map((tab) => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {visibleTabs.map((tab) => (
            <SortableTab
              key={tab.id}
              tab={tab}
              isActive={location.pathname === tab.url}
              onClick={() => openTab(tab)}
              onClose={() => closeTab(tab.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {hiddenTabs.length > 0 && (
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <button
            type="button"
            aria-label={isDropdownOpen ? 'Hide tabs' : 'Show hidden tabs'}
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen((isOpen) => !isOpen)}
            style={{
              display: 'grid',
              width: OVERFLOW_BUTTON_WIDTH,
              height: OVERFLOW_BUTTON_WIDTH,
              padding: 0,
              placeItems: 'center',
              color: 'white',
              background: '#2563eb',
              border: 0,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {isDropdownOpen ? (
              <ChevronUp size={18} aria-hidden="true" />
            ) : (
              <ChevronDown size={18} aria-hidden="true" />
            )}
          </button>

          {isDropdownOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                zIndex: 10,
                display: 'flex',
                minWidth: 180,
                padding: 8,
                flexDirection: 'column',
                gap: 4,
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgb(0 0 0 / 15%)',
              }}
            >
              {hiddenTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={location.pathname === tab.url}
                  onClick={() => openTab(tab)}
                  onClose={() => closeTab(tab.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -10000,
          left: -10000,
          display: 'flex',
          gap: TABS_GAP,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {pinnedTabs.map((tab) => (
          <div key={tab.id} ref={(element) => setMeasuredTabRef(tab.id, element)}>
            <TabButton tab={tab} isActive={false} onClick={() => undefined} />
          </div>
        ))}
        {sortableTabs.map((tab) => (
          <div key={tab.id} ref={(element) => setMeasuredTabRef(tab.id, element)}>
            <TabButton
              tab={tab}
              isActive={false}
              onClick={() => undefined}
              onClose={() => undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabsComponent;

import { useEffect, useMemo, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { initialTabs, type Tab } from '../mockData';

const STORAGE_KEY = 'tabsOrder';

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ tab, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      {tab.title}
    </button>
  );
}

function SortableTab({ tab, isActive, onClick }: TabButtonProps) {
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
      <TabButton tab={tab} isActive={isActive} onClick={onClick} />
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
  const navigate = useNavigate();
  const location = useLocation();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
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

        if (Array.isArray(parsedTabs) && parsedTabs.every(isStoredTab)) {
          setTabs(parsedTabs);
          setIsHydrated(true);
          return;
        }
      } catch {
        // Ignore invalid stored data and restore the default tabs
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

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = sortableTabs.findIndex((tab) => tab.id === active.id);
    const newIndex = sortableTabs.findIndex((tab) => tab.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setTabs([...pinnedTabs, ...arrayMove(sortableTabs, oldIndex, newIndex)]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
      {pinnedTabs.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={location.pathname === tab.url}
          onClick={() => navigate(tab.url)}
        />
      ))}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableTabs.map((tab) => tab.id)}
          strategy={horizontalListSortingStrategy}
        >
          {sortableTabs.map((tab) => (
            <SortableTab
              key={tab.id}
              tab={tab}
              isActive={location.pathname === tab.url}
              onClick={() => navigate(tab.url)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default TabsComponent;

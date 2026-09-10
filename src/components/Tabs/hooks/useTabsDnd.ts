import { useCallback, type Dispatch, type SetStateAction } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Tab } from '../../../mockData';

export interface UseTabsDndOptions {
  pinnedTabs: Tab[];
  regularTabs: Tab[];
  setTabs: Dispatch<SetStateAction<Tab[]>>;
}

export function useTabsDnd({
  pinnedTabs,
  regularTabs,
  setTabs,
}: UseTabsDndOptions) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;

      const activePinnedIndex = pinnedTabs.findIndex(
        (tab) => tab.id === active.id,
      );
      const overPinnedIndex = pinnedTabs.findIndex((tab) => tab.id === over.id);

      if (activePinnedIndex !== -1 && overPinnedIndex !== -1) {
        setTabs([
          ...arrayMove(pinnedTabs, activePinnedIndex, overPinnedIndex),
          ...regularTabs,
        ]);
        return;
      }

      const activeRegularIndex = regularTabs.findIndex(
        (tab) => tab.id === active.id,
      );
      const overRegularIndex = regularTabs.findIndex(
        (tab) => tab.id === over.id,
      );

      if (activeRegularIndex === -1 || overRegularIndex === -1) return;

      setTabs([
        ...pinnedTabs,
        ...arrayMove(regularTabs, activeRegularIndex, overRegularIndex),
      ]);
    },
    [pinnedTabs, regularTabs, setTabs],
  );

  return { sensors, handleDragEnd };
}

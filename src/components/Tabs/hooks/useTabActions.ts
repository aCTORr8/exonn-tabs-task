import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Tab } from '../../../mockData';

export interface UseTabActionsOptions {
  setTabs: Dispatch<SetStateAction<Tab[]>>;
  closeDropdown: () => void;
}

export function useTabActions({
  setTabs,
  closeDropdown,
}: UseTabActionsOptions) {
  const navigate = useNavigate();

  const openTab = useCallback(
    (tab: Tab) => {
      navigate(tab.url);
      closeDropdown();
    },
    [closeDropdown, navigate],
  );

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((currentTabs) => currentTabs.filter((tab) => tab.id !== tabId));
      closeDropdown();
    },
    [closeDropdown, setTabs],
  );

  const togglePin = useCallback(
    (tabId: string) => {
      setTabs((currentTabs) => {
        const selectedTab = currentTabs.find((tab) => tab.id === tabId);
        if (!selectedTab) return currentTabs;

        const otherTabs = currentTabs.filter((tab) => tab.id !== tabId);

        if (selectedTab.isPinned) {
          const pinned = otherTabs.filter((tab) => tab.isPinned);
          const regular = otherTabs.filter((tab) => !tab.isPinned);

          return [...pinned, { ...selectedTab, isPinned: false }, ...regular];
        }

        return [{ ...selectedTab, isPinned: true }, ...otherTabs];
      });
    },
    [setTabs],
  );

  return { openTab, closeTab, togglePin };
}

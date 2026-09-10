import type { TabContentProps } from './TabContent';
import { TabContent } from './TabContent';
import { SortableTab } from './SortableTab';

export type TabItemProps = Omit<TabContentProps, 'isDropdownItem'>;

export function TabItem(props: TabItemProps) {
  return (
    <SortableTab id={props.tab.id}>
      <TabContent {...props} />
    </SortableTab>
  );
}

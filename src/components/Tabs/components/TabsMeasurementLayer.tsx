import type { Tab } from '../../../mockData';
import { PinnedTabContent } from './PinnedTabItem';
import { TabContent } from './TabContent';

export interface TabsMeasurementLayerProps {
  pinnedTabs: Tab[];
  regularTabs: Tab[];
  setMeasuredTabRef: (tabId: string, element: HTMLDivElement | null) => void;
}

export function TabsMeasurementLayer({
  pinnedTabs,
  regularTabs,
  setMeasuredTabRef,
}: TabsMeasurementLayerProps) {
  return (
    <div aria-hidden="true" className="tabs-measurement-row">
      {pinnedTabs.map((tab) => (
        <div key={tab.id} ref={(element) => setMeasuredTabRef(tab.id, element)}>
          <PinnedTabContent
            tab={tab}
            isActive={false}
            onClick={() => undefined}
          />
        </div>
      ))}
      {regularTabs.map((tab) => (
        <div key={tab.id} ref={(element) => setMeasuredTabRef(tab.id, element)}>
          <TabContent
            tab={tab}
            isActive={false}
            onClick={() => undefined}
            onClose={() => undefined}
          />
        </div>
      ))}
    </div>
  );
}

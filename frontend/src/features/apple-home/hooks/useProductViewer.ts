import { useMemo, useState } from 'react';
import type { Scent, ScentId, ViewerTab } from '../types';

export function getViewerCopy(scent: Scent, tab: ViewerTab) {
  const copy: Record<ViewerTab, string> = {
    scent: `${scent.line} ${scent.mood}.`,
    notes: scent.notes,
    bottle: `${scent.bottle} الاتجاه البصري: ${scent.aura}.`,
    sizes: scent.sizes,
    gift: scent.gift,
    usage: scent.usage,
  };

  return copy[tab];
}

export function useProductViewer(scents: Scent[]) {
  const [selectedScentId, setSelectedScentId] = useState<ScentId>('sharara');
  const [selectedTab, setSelectedTab] = useState<ViewerTab>('scent');
  const activeScent = useMemo(
    () => scents.find((scent) => scent.id === selectedScentId) ?? scents[0],
    [scents, selectedScentId],
  );
  const activeCopy = getViewerCopy(activeScent, selectedTab);

  const selectScent = (scentId: ScentId) => {
    setSelectedScentId(scentId);
    setSelectedTab('scent');
  };

  return {
    activeCopy,
    activeScent,
    selectScent,
    selectedScentId,
    selectedTab,
    setSelectedTab,
  };
}

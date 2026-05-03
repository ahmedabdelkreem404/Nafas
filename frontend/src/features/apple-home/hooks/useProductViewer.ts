import { useMemo, useState } from 'react';
import type { Locale } from '../../../context/LocaleContext';
import { appleHomeCopy, getScentCopy, text } from '../data/appleHomeCopy';
import type { Scent, ScentId, ViewerTab } from '../types';

export function getViewerCopy(scent: Scent, tab: ViewerTab, locale: Locale) {
  const localizedScent = getScentCopy(scent);
  const tabCopy: Record<ViewerTab, string> = {
    scent: `${text(localizedScent.line, locale)} ${text(localizedScent.mood, locale)}.`,
    notes: text(localizedScent.notes, locale),
    bottle: `${text(localizedScent.bottle, locale)} ${text(appleHomeCopy.viewer.visualDirection, locale)}: ${text(localizedScent.aura, locale)}.`,
    sizes: text(localizedScent.sizes, locale),
    gift: text(localizedScent.gift, locale),
    usage: text(localizedScent.usage, locale),
  };

  return tabCopy[tab];
}

export function useProductViewer(scents: Scent[], locale: Locale) {
  const [selectedScentId, setSelectedScentId] = useState<ScentId>('sharara');
  const [selectedTab, setSelectedTab] = useState<ViewerTab>('scent');
  const activeScent = useMemo(
    () => scents.find((scent) => scent.id === selectedScentId) ?? scents[0],
    [scents, selectedScentId],
  );
  const activeCopy = getViewerCopy(activeScent, selectedTab, locale);

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

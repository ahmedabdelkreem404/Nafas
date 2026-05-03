import { useMemo, useState } from 'react';
import type { Locale } from '../../../context/LocaleContext';
import { getScentCopy, text } from '../data/appleHomeCopy';
import type { ChoiceId, Scent } from '../types';

export function useScentChoice(scents: Scent[], locale: Locale) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId>('discovery');
  const recommendation = useMemo(() => {
    if (selectedChoice === 'discovery') {
      return 'Discovery Mini';
    }

    const scent = scents.find((item) => item.id === selectedChoice);
    return scent ? text(getScentCopy(scent).name, locale) : 'Discovery Mini';
  }, [locale, scents, selectedChoice]);

  return {
    recommendation,
    selectedChoice,
    setSelectedChoice,
  };
}

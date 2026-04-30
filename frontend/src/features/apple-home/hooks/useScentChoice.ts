import { useMemo, useState } from 'react';
import type { Locale } from '../../../context/LocaleContext';
import { scentCopy, text } from '../data/appleHomeCopy';
import type { ChoiceId, Scent } from '../types';

export function useScentChoice(scents: Scent[], locale: Locale) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId>('discovery');
  const recommendation = useMemo(() => {
    if (selectedChoice === 'discovery') {
      return locale === 'ar' ? 'مجموعة التجربة' : 'Discovery Set';
    }

    const scent = scents.find((item) => item.id === selectedChoice);
    return scent ? text(scentCopy[scent.id].name, locale) : (locale === 'ar' ? 'مجموعة التجربة' : 'Discovery Set');
  }, [locale, scents, selectedChoice]);

  return {
    recommendation,
    selectedChoice,
    setSelectedChoice,
  };
}

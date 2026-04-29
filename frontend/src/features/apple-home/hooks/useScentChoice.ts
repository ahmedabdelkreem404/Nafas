import { useMemo, useState } from 'react';
import type { ChoiceId, Scent } from '../types';

export function useScentChoice(scents: Scent[]) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId>('discovery');
  const recommendation = useMemo(() => {
    if (selectedChoice === 'discovery') {
      return 'Discovery Mini';
    }

    return scents.find((scent) => scent.id === selectedChoice)?.nameAr ?? 'Discovery Mini';
  }, [scents, selectedChoice]);

  return {
    recommendation,
    selectedChoice,
    setSelectedChoice,
  };
}

import type { SelectorOption, TrustCard } from '../types';

export const selectorOptions: SelectorOption[] = [
  { id: 'sharara', label: 'sharara' },
  { id: 'ghayma', label: 'ghayma' },
  { id: 'dafwa', label: 'dafwa' },
  { id: 'zell', label: 'zell' },
  { id: 'discovery', label: 'discovery' },
];

export const trustCards: TrustCard[] = [
  {
    id: 'fixed-formulas',
    title: 'fixed-formulas',
    copy: 'fixed-formulas',
  },
  {
    id: 'batch-checks',
    title: 'batch-checks',
    copy: 'batch-checks',
  },
  {
    id: 'tester-first',
    title: 'tester-first',
    copy: 'tester-first',
  },
  {
    id: 'support',
    title: 'support',
    copy: 'support',
  },
];

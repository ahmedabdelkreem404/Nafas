import type { ViewerTabOption } from './types';

export const SECTION_LABELS = {
  ribbon: 'ribbon',
  hero: 'hero',
  cinematic: 'cinematic-scents',
  highlights: 'highlights',
  emotional: 'emotional',
  viewer: 'product-viewer',
  chapters: 'story-chapters',
  senses: 'senses',
  tester: 'tester-to-bottle',
  ritual: 'ritual',
  together: 'better-together',
  selector: 'scent-selector',
  trust: 'trust',
  comparison: 'comparison',
  explore: 'keep-exploring',
  final: 'final-cta',
} as const;

export const viewerTabs: ViewerTabOption[] = [
  { id: 'scent', label: 'الرائحة' },
  { id: 'notes', label: 'النوتات' },
  { id: 'bottle', label: 'العبوة' },
  { id: 'sizes', label: 'المقاسات' },
  { id: 'gift', label: 'الهدية' },
  { id: 'usage', label: 'الاستخدام' },
];

export const AUTOPLAY_INTERVAL_MS = 5200;

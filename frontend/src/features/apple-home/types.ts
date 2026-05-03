import type { KeyboardEvent, TouchEvent } from 'react';

export type ScentId = string;
export type ChoiceId = ScentId | 'discovery';
export type ViewerTab = 'scent' | 'notes' | 'bottle' | 'sizes' | 'gift' | 'usage';

export type Scent = {
  id: ScentId;
  name: string;
  nameAr: string;
  line: string;
  mood: string;
  accent: string;
  aura: string;
  heroDescription: string;
  scene: {
    bgStart: string;
    bgEnd: string;
    depthLeft: string;
    depthRight: string;
    mist: string;
    surface: string;
    flash: string;
  };
  bestFor: string;
  notes: string;
  bottle: string;
  sizes: string;
  gift: string;
  usage: string;
};

export type Highlight = {
  id: ScentId | 'discovery' | 'gift' | 'quality';
  title: string;
  eyebrow: string;
  copy: string;
  image?: string;
  tone: string;
};

export type ViewerTabOption = {
  id: ViewerTab;
  label: string;
};

export type StoryChapter = {
  id: string;
  title: string;
  copy: string;
  image: string;
};

export type SensoryLayer = {
  id: string;
  title: string;
  copy: string;
};

export type FlowStep = {
  id: string;
  title: string;
};

export type TrustCard = {
  id: string;
  title: string;
  copy: string;
};

export type ExploreCard = {
  id: string;
  title: string;
  copy: string;
  href: string;
  external?: boolean;
};

export type SelectorOption = {
  id: ChoiceId;
  label: string;
};

export type HighlightsCarouselApi = {
  activeIndex: number;
  isPlaying: boolean;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  togglePlay: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
};

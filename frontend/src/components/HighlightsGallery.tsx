import HighlightsCarousel from './home/HighlightsCarousel';
import type { LandingHighlight } from '../content/nafasLanding';

type HighlightsGalleryProps = {
  items: LandingHighlight[];
};

export default function HighlightsGallery({ items }: HighlightsGalleryProps) {
  return <HighlightsCarousel items={items} />;
}

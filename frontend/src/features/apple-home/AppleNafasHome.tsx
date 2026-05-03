import BetterTogetherSection from './components/BetterTogetherSection';
import CinematicRitualSection from './components/CinematicRitualSection';
import ComparisonSection from './components/ComparisonSection';
import EmotionalMomentSection from './components/EmotionalMomentSection';
import FinalCtaSection from './components/FinalCtaSection';
import HeroSection from './components/HeroSection';
import HighlightsSection from './components/HighlightsSection';
import HomeRibbon from './components/HomeRibbon';
import KeepExploringSection from './components/KeepExploringSection';
import ProductViewerSection from './components/ProductViewerSection';
import ScentSelectorSection from './components/ScentSelectorSection';
import SensesSection from './components/SensesSection';
import StoryChaptersSection from './components/StoryChaptersSection';
import TesterToBottleSection from './components/TesterToBottleSection';
import TrustSection from './components/TrustSection';
import { sensoryLayers, storyChapters, testerFlowSteps } from './data/chapters';
import { exploreCards } from './data/explore';
import { highlights } from './data/highlights';
import { scents } from './data/scents';
import { selectorOptions, trustCards } from './data/trust';
import { useBodyHomeClass } from './hooks/useBodyHomeClass';
import { useLocale } from '../../context/LocaleContext';

export default function AppleNafasHome() {
  const { dir, locale } = useLocale();
  useBodyHomeClass();

  return (
    <div className={`apple-nafas-page apple-nafas-page--${locale}`} dir={dir} lang={locale}>
      <HomeRibbon />
      <CinematicRitualSection scents={scents} />
      <HighlightsSection highlights={highlights} scents={scents} />
      <EmotionalMomentSection scents={scents} />
      <ProductViewerSection scents={scents} />
      <StoryChaptersSection chapters={storyChapters} />
      <SensesSection layers={sensoryLayers} />
      <TesterToBottleSection steps={testerFlowSteps} />
      <HeroSection scents={scents} />
      <BetterTogetherSection featuredScent={scents[1]} />
      <ScentSelectorSection options={selectorOptions} scents={scents} />
      <TrustSection cards={trustCards} />
      <ComparisonSection scents={scents} />
      <KeepExploringSection cards={exploreCards} />
      <FinalCtaSection />
    </div>
  );
}

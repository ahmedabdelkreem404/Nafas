import ComparisonSection from './components/ComparisonSection';
import FinalCtaSection from './components/FinalCtaSection';
import HeroSection from './components/HeroSection';
import HighlightsSection from './components/HighlightsSection';
import HomeRibbon from './components/HomeRibbon';
import ScentSelectorSection from './components/ScentSelectorSection';
import StoryChaptersSection from './components/StoryChaptersSection';
import TesterToBottleSection from './components/TesterToBottleSection';
import TrustSection from './components/TrustSection';
import { storyChapters, testerFlowSteps } from './data/chapters';
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
      <HeroSection scents={scents} />
      <HighlightsSection highlights={highlights} scents={scents} />
      <ComparisonSection scents={scents} />
      <StoryChaptersSection chapters={storyChapters} />
      <TesterToBottleSection steps={testerFlowSteps} />
      <ScentSelectorSection options={selectorOptions} scents={scents} />
      <TrustSection cards={trustCards} />
      <FinalCtaSection />
    </div>
  );
}

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
import type { Scent } from './types';

type CmsProduct = {
  slug?: string;
  name_ar?: string;
  name_en?: string;
  marketing_line_ar?: string;
  marketing_line_en?: string;
  personality?: string;
  scent_notes?: string;
  public_label_ar?: string;
  public_label_en?: string;
  scent_family?: string;
  hero_image_url?: string;
  card_image_url?: string;
  mobile_image_url?: string;
  home_image_url?: string;
  home_mobile_image_url?: string;
  home_link_url?: string;
};

type CmsSectionItem = {
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  body_ar?: string;
  body_en?: string;
  image_url?: string;
  mobile_image_url?: string;
  accent_color?: string;
  link_url?: string;
  product?: CmsProduct | null;
};

type CmsSection = {
  section_key: string;
  type?: string;
  sort_order?: number;
  is_active?: boolean;
  items?: CmsSectionItem[];
};

type CmsHomepage = {
  sections?: CmsSection[];
};

const defaultSectionOrder = [
  'ribbon',
  'ritual',
  'highlights',
  'emotional',
  'product-viewer',
  'story-chapters',
  'senses',
  'tester-to-bottle',
  'hero',
  'better-together',
  'scent-selector',
  'trust',
  'comparison',
  'keep-exploring',
  'final-cta',
];

const sceneFallbacks = scents.map((scent) => scent.scene);

function normalizeCmsData(cmsData: unknown): CmsHomepage | null {
  if (!cmsData || typeof cmsData !== 'object') return null;
  const maybe = cmsData as CmsHomepage;
  return Array.isArray(maybe.sections) ? maybe : null;
}

function buildScentFromItem(item: CmsSectionItem, index: number): Scent | null {
  const product = item.product;
  const slug = product?.slug || item.link_url?.split('/').filter(Boolean).pop();
  if (!slug) return null;

  const staticMatch = scents.find((scent) => scent.id === slug);
  if (staticMatch) {
    return {
      ...staticMatch,
      name: product?.name_en || item.title_en || staticMatch.name,
      nameAr: product?.name_ar || item.title_ar || staticMatch.nameAr,
      line: product?.marketing_line_ar || item.subtitle_ar || staticMatch.line,
      mood: product?.scent_family || product?.personality || staticMatch.mood,
      notes: product?.scent_notes || staticMatch.notes,
      href: product?.home_link_url || item.link_url || `/products/${slug}`,
      image: item.image_url || product?.home_image_url || product?.card_image_url || product?.hero_image_url,
      mobileImage: item.mobile_image_url || product?.home_mobile_image_url || product?.mobile_image_url,
    };
  }

  const scene = sceneFallbacks[index % sceneFallbacks.length] ?? scents[0].scene;
  return {
    id: slug,
    name: product?.name_en || item.title_en || slug,
    nameAr: product?.name_ar || item.title_ar || product?.name_en || slug,
    line: product?.marketing_line_ar || item.subtitle_ar || 'اختيار عطري من نفس.',
    mood: product?.scent_family || product?.personality || 'crafted perfume',
    accent: item.accent_color || '#c9a15a',
    aura: product?.public_label_ar || 'Nafas crafted aura',
    heroDescription: product?.marketing_line_ar || item.body_ar || 'تركيبة مختارة تقدر تتحكم في ظهورها من لوحة التحكم.',
    scene,
    bestFor: item.subtitle_ar || 'اختيار قابل للتخصيص من لوحة التحكم.',
    notes: product?.scent_notes || 'طابع عطري عام يظهر بدون تفاصيل داخلية.',
    bottle: 'تصوير المنتج قابل للتغيير من لوحة التحكم.',
    sizes: 'المقاسات والأسعار من بيانات المنتج.',
    gift: 'مناسب حسب الكتالوج الذي ينتمي له.',
    usage: product?.personality || 'حسب الطابع العطري.',
    href: product?.home_link_url || item.link_url || `/products/${slug}`,
    image: item.image_url || product?.home_image_url || product?.card_image_url || product?.hero_image_url,
    mobileImage: item.mobile_image_url || product?.home_mobile_image_url || product?.mobile_image_url,
  };
}

function getCmsScents(homepage: CmsHomepage | null): Scent[] {
  const productItems = homepage?.sections
    ?.flatMap((section) => section.items || [])
    .filter((item) => item.product || item.link_url?.includes('/products/')) || [];

  if (!productItems.length) return scents;

  const seen = new Set<string>();
  const dynamicScents = productItems
    .map(buildScentFromItem)
    .filter((scent): scent is Scent => Boolean(scent))
    .filter((scent) => {
      if (seen.has(scent.id)) return false;
      seen.add(scent.id);
      return true;
    });

  return dynamicScents.length ? dynamicScents : scents;
}

function getRenderOrder(homepage: CmsHomepage | null) {
  const sections = homepage?.sections;
  if (!sections?.length) return defaultSectionOrder;

  const allowed = new Set(defaultSectionOrder);
  const activeKeys = sections
    .filter((section) => section.is_active !== false && allowed.has(section.section_key))
    .sort((left, right) => (left.sort_order || 0) - (right.sort_order || 0))
    .map((section) => section.section_key);

  return activeKeys.length ? activeKeys : defaultSectionOrder;
}

export default function AppleNafasHome({ cmsData }: { cmsData?: unknown }) {
  const { dir, locale } = useLocale();
  useBodyHomeClass();
  const homepage = normalizeCmsData(cmsData);
  const homeScents = getCmsScents(homepage);
  const renderOrder = getRenderOrder(homepage);

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'ribbon':
        return <HomeRibbon key={sectionKey} />;
      case 'ritual':
        return <CinematicRitualSection key={sectionKey} scents={homeScents} />;
      case 'highlights':
        return <HighlightsSection key={sectionKey} highlights={highlights} scents={homeScents} />;
      case 'emotional':
        return <EmotionalMomentSection key={sectionKey} scents={homeScents} />;
      case 'product-viewer':
        return <ProductViewerSection key={sectionKey} scents={homeScents} />;
      case 'story-chapters':
        return <StoryChaptersSection key={sectionKey} chapters={storyChapters} />;
      case 'senses':
        return <SensesSection key={sectionKey} layers={sensoryLayers} />;
      case 'tester-to-bottle':
        return <TesterToBottleSection key={sectionKey} steps={testerFlowSteps} />;
      case 'hero':
        return <HeroSection key={sectionKey} scents={homeScents} />;
      case 'better-together':
        return <BetterTogetherSection key={sectionKey} featuredScent={homeScents[1] || homeScents[0]} />;
      case 'scent-selector':
        return <ScentSelectorSection key={sectionKey} options={selectorOptions} scents={homeScents} />;
      case 'trust':
        return <TrustSection key={sectionKey} cards={trustCards} />;
      case 'comparison':
        return <ComparisonSection key={sectionKey} scents={homeScents} />;
      case 'keep-exploring':
        return <KeepExploringSection key={sectionKey} cards={exploreCards} />;
      case 'final-cta':
        return <FinalCtaSection key={sectionKey} />;
      default:
        return null;
    }
  };

  return (
    <div className={`apple-nafas-page apple-nafas-page--${locale}`} dir={dir} lang={locale}>
      {renderOrder.map(renderSection)}
    </div>
  );
}

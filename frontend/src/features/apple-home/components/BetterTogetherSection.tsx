import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, text } from '../data/appleHomeCopy';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type BetterTogetherSectionProps = {
  featuredScent: Scent;
};

export default function BetterTogetherSection({ featuredScent }: BetterTogetherSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.together;

  return (
    <section className="anh-section anh-together anh-together--dark-discovery" data-section={SECTION_LABELS.together} aria-labelledby="together-title">
      <div className="anh-container anh-together__grid">
        <div>
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="together-title">{text(copy.title, locale)}</h2>
          <p>{text(copy.body, locale)}</p>
          <a className="anh-button anh-button--primary" href="/discovery-set">{text(copy.cta, locale)}</a>
        </div>
        <div className="anh-together__visual" aria-hidden="true">
          <img src="/assets/stock/optimized/hero-perfume-fabric.webp" alt="" loading="lazy" decoding="async" />
          <BottleVisual scent={featuredScent} />
        </div>
      </div>
    </section>
  );
}

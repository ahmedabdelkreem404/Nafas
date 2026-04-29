import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, scentCopy, text } from '../data/appleHomeCopy';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type HeroSectionProps = {
  scents: Scent[];
};

export default function HeroSection({ scents }: HeroSectionProps) {
  const { locale } = useLocale();
  const featuredScent = scents[0];
  const copy = appleHomeCopy.hero;

  return (
    <section className="anh-section anh-hero anh-landing-hero" data-section={SECTION_LABELS.hero} aria-labelledby="hero-title" data-proof="hero">
      <div className="anh-landing-hero__media" aria-hidden="true">
        <div className="anh-landing-hero__veil" />
        <div className="anh-landing-hero__fabric anh-landing-hero__fabric--left" />
        <div className="anh-landing-hero__fabric anh-landing-hero__fabric--right" />
        <div className="anh-landing-hero__frame">
          <div className="anh-landing-hero__light" />
          <BottleVisual scent={featuredScent} className="anh-landing-hero__bottle" />
          <div className="anh-landing-hero__mini-row">
            {scents.map((scent) => (
              <BottleVisual key={scent.id} scent={scent} className="anh-landing-hero__mini-bottle" />
            ))}
          </div>
        </div>
      </div>

      <div className="anh-container anh-landing-hero__content">
        <div className="anh-landing-hero__copy">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h1 id="hero-title">{text(copy.title, locale)}</h1>
          <p className="anh-landing-hero__lead">{text(copy.lead, locale)}</p>
          <div className="anh-actions">
            <a className="anh-button anh-button--primary" href="#choose">{text(appleHomeCopy.ritual.primaryCta, locale)}</a>
            <a className="anh-button anh-button--secondary" href="#tester-path">{text(appleHomeCopy.ritual.secondaryCta, locale)}</a>
          </div>
        </div>

        <div className="anh-landing-hero__caption" aria-hidden="true">
          <span>{text(copy.caption, locale)}</span>
          <strong>{text(scentCopy[featuredScent.id].name, locale)}</strong>
        </div>
      </div>
    </section>
  );
}

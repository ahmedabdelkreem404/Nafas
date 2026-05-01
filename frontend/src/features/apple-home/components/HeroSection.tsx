import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, text } from '../data/appleHomeCopy';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type HeroSectionProps = {
  scents: Scent[];
};

export default function HeroSection({ scents }: HeroSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.hero;
  const ritualCopy = appleHomeCopy.ritual;

  return (
    <section className="anh-section anh-hero anh-landing-hero" data-section={SECTION_LABELS.hero} aria-labelledby="hero-title" data-proof="hero">
      <div className="anh-landing-hero__media" aria-hidden="true">
        <div className="anh-landing-hero__veil" />
        <div className="anh-landing-hero__fabric anh-landing-hero__fabric--left" />
        <div className="anh-landing-hero__fabric anh-landing-hero__fabric--right" />
        <div className="anh-landing-hero__frame">
          <div className="anh-landing-hero__light" />
          <div className="anh-landing-hero__shelf" />
          <BottleVisual scent={scents[0]} className="anh-landing-hero__bottle" />
          <div className="anh-landing-hero__mini-row">
            {scents.slice(1).map((scent) => (
              <BottleVisual key={scent.id} scent={scent} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="anh-container anh-landing-hero__content">
        <div className="anh-landing-hero__copy">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2>{text(copy.title, locale)}</h2>
          <p className="anh-landing-hero__lead">{text(copy.lead, locale)}</p>
          <div className="anh-actions">
            <a className="anh-button anh-button--primary" href="#choose">{text(ritualCopy.primaryCta, locale)}</a>
            <a className="anh-button anh-button--secondary" href="/discovery-set">{text(ritualCopy.secondaryCta, locale)}</a>
          </div>
        </div>
        
        <div className="anh-landing-hero__caption" aria-hidden="true">
          <span>{text(ritualCopy.kicker, locale)}</span>
          <h1 id="hero-title">{text(copy.caption, locale)}</h1>
          <strong>{scents[0].name}</strong>
        </div>
      </div>
    </section>
  );
}

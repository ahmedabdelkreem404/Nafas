import { SECTION_LABELS } from '../constants';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type HeroSectionProps = {
  scents: Scent[];
};

export default function HeroSection({ scents }: HeroSectionProps) {
  const featuredScent = scents[0];

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
          <p className="anh-kicker">Maison Nafas</p>
          <h1 id="hero-title">نفَس قريب منك.</h1>
          <p className="anh-landing-hero__lead">أربع روائح محلية بهوية هادئة: شرارة، غيمة، دفوة، وظلّ. ابدأ بتستر صغير، واختار الرائحة التي تشبه حضورك.</p>
          <div className="anh-actions">
            <a className="anh-button anh-button--primary" href="#choose">اكتشف المجموعة</a>
            <a className="anh-button anh-button--secondary" href="#tester-path">اطلب تستر</a>
          </div>
        </div>

        <div className="anh-landing-hero__caption" aria-hidden="true">
          <span>Nafas eau de parfum</span>
          <strong>{featuredScent.nameAr}</strong>
        </div>
      </div>
    </section>
  );
}

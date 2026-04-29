import { SECTION_LABELS } from '../constants';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type HeroSectionProps = {
  scents: Scent[];
};

export default function HeroSection({ scents }: HeroSectionProps) {
  return (
    <section className="anh-section anh-hero" data-section={SECTION_LABELS.hero} aria-labelledby="hero-title" data-proof="hero">
      <div className="anh-container anh-hero__inner">
        <div className="anh-hero__copy">
          <p className="anh-kicker">Nafas eau de parfum</p>
          <h1 id="hero-title">نفَس.</h1>
          <p className="anh-hero__sub">أول رشة تفضل.</p>
          <p className="anh-hero__text">عطور محلية Premium بأربع حالات مزاجية: فريش، ناعم، دافئ، وغامض.</p>
          <div className="anh-actions">
            <a className="anh-button anh-button--primary" href="#choose">اكتشف المجموعة</a>
            <a className="anh-button anh-button--secondary" href="#tester-path">اطلب تستر</a>
          </div>
        </div>

        <div className="anh-hero__stage" aria-label="زجاجات عطور نفَس الأربع">
          <div className="anh-hero__glow" />
          {scents.map((scent, index) => (
            <BottleVisual
              key={scent.id}
              scent={scent}
              className={`anh-hero__bottle anh-hero__bottle--${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

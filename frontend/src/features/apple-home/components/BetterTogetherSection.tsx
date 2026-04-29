import { SECTION_LABELS } from '../constants';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type BetterTogetherSectionProps = {
  featuredScent: Scent;
};

export default function BetterTogetherSection({ featuredScent }: BetterTogetherSectionProps) {
  return (
    <section className="anh-section anh-together" data-section={SECTION_LABELS.together} aria-labelledby="together-title">
      <div className="anh-container anh-together__grid">
        <div>
          <p className="anh-kicker">Better together</p>
          <h2 id="together-title">أفضل كمجموعة.</h2>
          <p>Discovery Mini للتجربة، زجاجة كاملة عندما تستقر على مودك، وGift Set لتقديم هادئ.</p>
          <a className="anh-button anh-button--primary" href="#tester-path">ابدأ بالمجموعة</a>
        </div>
        <div className="anh-together__visual" aria-hidden="true">
          <img src="/assets/stock/optimized/hero-perfume-fabric.webp" alt="" loading="lazy" decoding="async" />
          <BottleVisual scent={featuredScent} />
        </div>
      </div>
    </section>
  );
}

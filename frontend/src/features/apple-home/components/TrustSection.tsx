import { SECTION_LABELS } from '../constants';
import type { TrustCard } from '../types';

type TrustSectionProps = {
  cards: TrustCard[];
};

export default function TrustSection({ cards }: TrustSectionProps) {
  return (
    <section className="anh-section anh-why" data-section={SECTION_LABELS.trust} aria-labelledby="why-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">No compromises</p>
          <h2 id="why-title">بدون تنازلات في التجربة.</h2>
        </div>
        <div className="anh-why__grid">
          {cards.map((card) => (
            <article key={card.id}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SECTION_LABELS } from '../constants';
import type { SensoryLayer } from '../types';

type SensesSectionProps = {
  layers: SensoryLayer[];
};

export default function SensesSection({ layers }: SensesSectionProps) {
  return (
    <section className="anh-section anh-senses" data-section={SECTION_LABELS.senses} aria-labelledby="senses-title">
      <div className="anh-container">
        <div className="anh-senses__stage">
          <div className="anh-senses__visual" aria-hidden="true">
            <img src="/assets/stock/optimized/shop-perfume-luxury.webp" alt="" loading="lazy" decoding="async" />
            <span className="anh-senses__mist anh-senses__mist--one" />
            <span className="anh-senses__mist anh-senses__mist--two" />
          </div>
          <div className="anh-senses__copy">
            <p className="anh-kicker">A feast for the senses</p>
            <h2 id="senses-title">وليمة للحواس.</h2>
            {layers.map((layer) => (
              <article key={layer.id}>
                <strong>{layer.title}</strong>
                <p>{layer.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

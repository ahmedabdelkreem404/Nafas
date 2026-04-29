import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { SECTION_LABELS } from '../constants';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type ComparisonSectionProps = {
  scents: Scent[];
};

export default function ComparisonSection({ scents }: ComparisonSectionProps) {
  return (
    <section className="anh-section anh-compare" id="choose" data-section={SECTION_LABELS.comparison} aria-labelledby="choose-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">Help me choose</p>
          <h2 id="choose-title">اختار نفَسك.</h2>
        </div>
        <div className="anh-compare__grid">
          {scents.map((scent) => (
            <article key={scent.id} className="anh-compare-card" style={{ '--accent': scent.accent } as CSSProperties}>
              <div className="anh-compare-card__visual" aria-label={`زجاجة عطر ${scent.nameAr}`} role="img">
                <BottleVisual scent={scent} />
              </div>
              <span>{scent.name}</span>
              <h3>{scent.nameAr}</h3>
              <p>{scent.line}</p>
              <dl>
                <div>
                  <dt>Mood</dt>
                  <dd>{scent.mood}</dd>
                </div>
                <div>
                  <dt>Best for</dt>
                  <dd>{scent.bestFor}</dd>
                </div>
              </dl>
              <Link className="anh-button anh-button--secondary" to={`/products/${scent.id}`}>استكشف</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

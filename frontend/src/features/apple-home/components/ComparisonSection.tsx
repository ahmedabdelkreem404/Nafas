import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, scentCopy, text } from '../data/appleHomeCopy';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type ComparisonSectionProps = {
  scents: Scent[];
};

export default function ComparisonSection({ scents }: ComparisonSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.comparison;

  return (
    <section className="anh-section anh-compare" id="choose" data-section={SECTION_LABELS.comparison} aria-labelledby="choose-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="choose-title">{text(copy.title, locale)}</h2>
        </div>
        <div className="anh-compare__grid">
          {scents.map((scent) => {
            const localizedScent = scentCopy[scent.id];

            return (
              <article key={scent.id} className="anh-compare-card" style={{ '--accent': scent.accent } as CSSProperties}>
                <div className="anh-compare-card__visual" aria-label={`${text(copy.bottleAlt, locale)} ${text(localizedScent.name, locale)}`} role="img">
                  <BottleVisual scent={scent} />
                </div>
                <span>{scent.name}</span>
                <h3>{text(localizedScent.name, locale)}</h3>
                <p>{text(localizedScent.line, locale)}</p>
                <dl>
                  <div>
                    <dt>{text(copy.mood, locale)}</dt>
                    <dd>{text(localizedScent.mood, locale)}</dd>
                  </div>
                  <div>
                    <dt>{text(copy.bestFor, locale)}</dt>
                    <dd>{text(localizedScent.bestFor, locale)}</dd>
                  </div>
                  <div>
                    <dt>{text(copy.entry, locale)}</dt>
                    <dd>{text(localizedScent.entry, locale)}</dd>
                  </div>
                </dl>
                <Link className="anh-button anh-button--secondary" to={`/products/${scent.id}`}>{text(copy.cta, locale)}</Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

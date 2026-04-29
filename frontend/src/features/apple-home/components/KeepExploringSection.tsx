import { Link } from 'react-router-dom';
import { SECTION_LABELS } from '../constants';
import type { ExploreCard } from '../types';
import { buildWhatsappUrl } from '../utils/whatsapp';

type KeepExploringSectionProps = {
  cards: ExploreCard[];
};

export default function KeepExploringSection({ cards }: KeepExploringSectionProps) {
  return (
    <section className="anh-section anh-explore" data-section={SECTION_LABELS.explore} aria-labelledby="explore-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">Keep exploring</p>
          <h2 id="explore-title">كمّل الرحلة.</h2>
        </div>
        <div className="anh-explore__grid">
          {cards.map((card) => {
            const content = (
              <>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </>
            );

            if (card.external) {
              return (
                <a key={card.id} className="anh-explore-card" href={buildWhatsappUrl('أريد التواصل مع Nafas')} target="_blank" rel="noreferrer">
                  {content}
                </a>
              );
            }

            return (
              <Link key={card.id} className="anh-explore-card" to={card.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

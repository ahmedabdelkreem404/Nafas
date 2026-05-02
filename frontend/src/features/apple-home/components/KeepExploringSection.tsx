import { Link } from 'react-router-dom';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, exploreCopy, text } from '../data/appleHomeCopy';
import type { ExploreCard } from '../types';
import { buildWhatsappUrl } from '../utils/whatsapp';

type KeepExploringSectionProps = {
  cards: ExploreCard[];
};

export default function KeepExploringSection({ cards }: KeepExploringSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.explore;

  return (
    <section className="anh-section anh-explore" data-section={SECTION_LABELS.explore} aria-labelledby="explore-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="explore-title">{text(copy.title, locale)}</h2>
        </div>
        <div className="anh-explore__grid">
          {cards.map((card) => {
            const cardCopy = exploreCopy[card.id];
            const content = (
              <>
                <h3>{text(cardCopy.title, locale)}</h3>
                <p>{text(cardCopy.copy, locale)}</p>
              </>
            );

            if (card.external) {
              return (
                <a key={card.id} className="anh-explore-card" href={buildWhatsappUrl(text(copy.whatsappMessage, locale))} target="_blank" rel="noreferrer">
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

import { BadgeCheck, FlaskConical, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, text, trustCopy } from '../data/appleHomeCopy';
import type { TrustCard } from '../types';

type TrustSectionProps = {
  cards: TrustCard[];
};

const icons = {
  'batch-checks': ShieldCheck,
  'fixed-formulas': FlaskConical,
  support: MessageCircle,
  'tester-first': BadgeCheck,
} as const;

export default function TrustSection({ cards }: TrustSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.trust;

  return (
    <section className="anh-section anh-why" data-section={SECTION_LABELS.trust} aria-labelledby="why-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="why-title">{text(copy.title, locale)}</h2>
        </div>
        <div className="anh-why__grid">
          {cards.map((card) => {
            const cardCopy = trustCopy[card.id];
            const Icon = icons[card.id as keyof typeof icons] ?? BadgeCheck;

            return (
              <article key={card.id}>
                <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                <h3>{text(cardCopy.title, locale)}</h3>
                <p>{text(cardCopy.copy, locale)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

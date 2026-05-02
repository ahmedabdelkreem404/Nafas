import { BadgeCheck, FlaskConical, RotateCcw, Sparkles } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, flowCopy, text } from '../data/appleHomeCopy';
import type { FlowStep } from '../types';
import { buildWhatsappUrl } from '../utils/whatsapp';

type TesterToBottleSectionProps = {
  steps: FlowStep[];
};

const icons = {
  choose: BadgeCheck,
  return: RotateCcw,
  tester: FlaskConical,
  wear: Sparkles,
} as const;

export default function TesterToBottleSection({ steps }: TesterToBottleSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.flow;

  return (
    <section className="anh-section anh-flow" id="tester-path" data-section={SECTION_LABELS.tester} aria-labelledby="flow-title" data-proof="tester">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="flow-title">{text(copy.title, locale)}</h2>
        </div>
        <div className="anh-flow__panel">
          <div className="anh-flow__steps">
            {steps.map((step, index) => {
              const Icon = icons[step.id as keyof typeof icons] ?? Sparkles;
              const stepCopy = flowCopy[step.id];

              return (
                <article key={step.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                  <h3>{text(stepCopy.title, locale)}</h3>
                  <p>{text(stepCopy.copy, locale)}</p>
                </article>
              );
            })}
          </div>
          <div className="anh-flow__actions">
            <a className="anh-button anh-button--primary" href={buildWhatsappUrl(text(copy.primaryMessage, locale))} target="_blank" rel="noreferrer">{text(copy.primaryCta, locale)}</a>
            <a className="anh-button anh-button--secondary" href={buildWhatsappUrl(text(copy.orderMessage, locale))} target="_blank" rel="noreferrer">{text(copy.whatsappCta, locale)}</a>
            <a className="anh-button anh-button--secondary" href="#choose">{text(copy.sizesCta, locale)}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { SECTION_LABELS } from '../constants';
import type { FlowStep } from '../types';
import { buildWhatsappUrl } from '../utils/whatsapp';

type TesterToBottleSectionProps = {
  steps: FlowStep[];
};

export default function TesterToBottleSection({ steps }: TesterToBottleSectionProps) {
  return (
    <section className="anh-section anh-flow" id="tester-path" data-section={SECTION_LABELS.tester} aria-labelledby="flow-title" data-proof="tester">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">From tester to bottle</p>
          <h2 id="flow-title">ابدأ بتستر… واختار بثقة.</h2>
        </div>
        <div className="anh-flow__panel">
          <div className="anh-flow__steps">
            {steps.map((step, index) => (
              <article key={step.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
              </article>
            ))}
          </div>
          <div className="anh-flow__actions">
            <a className="anh-button anh-button--primary" href={buildWhatsappUrl('أريد بناء Discovery Set من Nafas')} target="_blank" rel="noreferrer">ابنِ Discovery Set</a>
            <a className="anh-button anh-button--secondary" href={buildWhatsappUrl('أريد الطلب عبر واتساب من Nafas')} target="_blank" rel="noreferrer">اطلب عبر واتساب</a>
            <a className="anh-button anh-button--secondary" href="#choose">شاهد الأحجام</a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { SECTION_LABELS } from '../constants';

export default function RitualSection() {
  return (
    <section className="anh-ritual" data-section={SECTION_LABELS.ritual} aria-labelledby="ritual-title">
      <img src="/assets/stock/optimized/hero-perfume-dark.webp" alt="" aria-hidden="true" />
      <div>
        <p className="anh-kicker">Nafas ritual</p>
        <h2 id="ritual-title">رشة واحدة تغير اللحظة.</h2>
        <p>زجاجة، ضوء، وطبقة هادئة من الرائحة تجعل اللحظة أوضح.</p>
      </div>
    </section>
  );
}

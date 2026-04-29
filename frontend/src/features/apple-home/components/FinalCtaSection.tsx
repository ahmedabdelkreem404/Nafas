import { SECTION_LABELS } from '../constants';

export default function FinalCtaSection() {
  return (
    <section className="anh-final" data-section={SECTION_LABELS.final} aria-labelledby="final-title">
      <h2 id="final-title">نفَس قريب منك.</h2>
      <p>ابدأ بتستر صغير، ودع الرائحة تختار سرعتها.</p>
      <a className="anh-button anh-button--primary" href="#tester-path">اطلب Discovery Mini</a>
    </section>
  );
}

import { SECTION_LABELS } from '../constants';

export default function HomeRibbon() {
  return (
    <section className="anh-ribbon" data-section={SECTION_LABELS.ribbon} aria-label="إعلان نفَس">
      <p>اكتشف مجموعة نفَس الأولى — أربع روائح، أربع حالات مزاجية، وتجربة تستر قبل الشراء.</p>
      <a href="#tester-path">اطلب Discovery Mini</a>
    </section>
  );
}

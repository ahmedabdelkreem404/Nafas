import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, text } from '../data/appleHomeCopy';

export default function FinalCtaSection() {
  const { locale } = useLocale();
  const copy = appleHomeCopy.final;

  return (
    <section className="anh-final" data-section={SECTION_LABELS.final} aria-labelledby="final-title">
      <h2 id="final-title">{text(copy.title, locale)}</h2>
      <p>{text(copy.body, locale)}</p>
      <a className="anh-button anh-button--primary" href="/scent-finder">{text(copy.cta, locale)}</a>
    </section>
  );
}

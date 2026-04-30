import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, text } from '../data/appleHomeCopy';
import { useLocale } from '../../../context/LocaleContext';

export default function HomeRibbon() {
  const { locale } = useLocale();
  const copy = appleHomeCopy.ribbon;

  return (
    <section className="anh-ribbon" data-section={SECTION_LABELS.ribbon} aria-label={text(copy.aria, locale)}>
      <p>{text(copy.body, locale)}</p>
      <a href="/discovery-set">{text(copy.cta, locale)}</a>
    </section>
  );
}

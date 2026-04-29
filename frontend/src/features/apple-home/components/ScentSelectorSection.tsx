import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, selectorCopy, text } from '../data/appleHomeCopy';
import { useScentChoice } from '../hooks/useScentChoice';
import type { Scent, SelectorOption } from '../types';

type ScentSelectorSectionProps = {
  options: SelectorOption[];
  scents: Scent[];
};

export default function ScentSelectorSection({ options, scents }: ScentSelectorSectionProps) {
  const { locale } = useLocale();
  const choice = useScentChoice(scents, locale);
  const copy = appleHomeCopy.selector;

  return (
    <section className="anh-section anh-selector" data-section={SECTION_LABELS.selector} aria-labelledby="selector-title">
      <div className="anh-container">
        <div className="anh-selector__panel">
          <div>
            <p className="anh-kicker">{text(copy.kicker, locale)}</p>
            <h2 id="selector-title">{text(copy.title, locale)}</h2>
            <p>{text(copy.body, locale)}</p>
          </div>
          <div className="anh-selector__options" aria-label={text(copy.options, locale)}>
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={choice.selectedChoice === option.id ? 'is-active' : ''}
                onClick={() => choice.setSelectedChoice(option.id)}
                aria-pressed={choice.selectedChoice === option.id}
              >
                {text(selectorCopy[option.id].label, locale)}
              </button>
            ))}
          </div>
          <p className="anh-selector__result" aria-live="polite">
            {text(copy.result, locale)}: <strong>{choice.recommendation}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

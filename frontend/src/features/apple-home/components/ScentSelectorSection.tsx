import { SECTION_LABELS } from '../constants';
import { useScentChoice } from '../hooks/useScentChoice';
import type { Scent, SelectorOption } from '../types';

type ScentSelectorSectionProps = {
  options: SelectorOption[];
  scents: Scent[];
};

export default function ScentSelectorSection({ options, scents }: ScentSelectorSectionProps) {
  const choice = useScentChoice(scents);

  return (
    <section className="anh-section anh-selector" data-section={SECTION_LABELS.selector} aria-labelledby="selector-title">
      <div className="anh-container">
        <div className="anh-selector__panel">
          <div>
            <p className="anh-kicker">Choosing made easy</p>
            <h2 id="selector-title">اختيار العطر أسهل.</h2>
            <p>اختار المود الأقرب لك، أو ابدأ بـ Discovery Mini لو لسه محتار.</p>
          </div>
          <div className="anh-selector__options" aria-label="اختيار المود">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={choice.selectedChoice === option.id ? 'is-active' : ''}
                onClick={() => choice.setSelectedChoice(option.id)}
                aria-pressed={choice.selectedChoice === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="anh-selector__result" aria-live="polite">اقتراح نفَس: <strong>{choice.recommendation}</strong></p>
        </div>
      </div>
    </section>
  );
}

import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, text } from '../data/appleHomeCopy';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type EmotionalMomentSectionProps = {
  scents: Scent[];
};

export default function EmotionalMomentSection({ scents }: EmotionalMomentSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.emotional;

  return (
    <section className="anh-section anh-love" data-section={SECTION_LABELS.emotional} aria-labelledby="love-title">
      <div className="anh-container anh-love__inner">
        <div>
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="love-title">{text(copy.title, locale)}</h2>
          <p>{text(copy.body, locale)}</p>
        </div>
        <div className="anh-love__orbit" aria-hidden="true">
          {scents.map((scent) => (
            <BottleVisual key={scent.id} scent={scent} />
          ))}
        </div>
      </div>
    </section>
  );
}

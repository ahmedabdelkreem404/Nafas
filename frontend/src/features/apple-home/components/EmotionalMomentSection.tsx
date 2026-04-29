import { SECTION_LABELS } from '../constants';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type EmotionalMomentSectionProps = {
  scents: Scent[];
};

export default function EmotionalMomentSection({ scents }: EmotionalMomentSectionProps) {
  return (
    <section className="anh-section anh-love" data-section={SECTION_LABELS.emotional} aria-labelledby="love-title">
      <div className="anh-container anh-love__inner">
        <div>
          <p className="anh-kicker">Brand moment</p>
          <h2 id="love-title">حب من أول رشة.</h2>
          <p>أربع روائح، أربع حالات مزاجية، وتجربة تستر تخليك تختار بثقة.</p>
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

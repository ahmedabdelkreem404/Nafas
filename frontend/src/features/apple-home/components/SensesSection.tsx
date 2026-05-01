import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, sensoryCopy, text } from '../data/appleHomeCopy';
import type { SensoryLayer } from '../types';

type SensesSectionProps = {
  layers: SensoryLayer[];
};

export default function SensesSection({ layers }: SensesSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.senses;

  return (
    <section className="anh-section anh-senses" data-section={SECTION_LABELS.senses} aria-labelledby="senses-title">
      <div className="anh-container">
        <div className="anh-senses__stage">
          <div className="anh-senses__visual" aria-hidden="true">
            <img src="/assets/stock/optimized/shop-perfume-luxury.webp" alt="" loading="lazy" decoding="async" />
            <span className="anh-senses__mist anh-senses__mist--one" />
            <span className="anh-senses__mist anh-senses__mist--two" />
          </div>
          
          <div className="anh-senses__copy">
            <p className="anh-kicker">{text(copy.kicker, locale)}</p>
            <h2 id="senses-title">{text(copy.title, locale)}</h2>
            
            {layers.map((layer) => {
              const layerCopy = sensoryCopy[layer.id];
              return (
                <article key={layer.id}>
                  <strong>{text(layerCopy.title, locale)}</strong>
                  <p>{text(layerCopy.copy, locale)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

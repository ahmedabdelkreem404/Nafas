import { landingFragrances } from '../../content/nafasLanding';
import type { LandingStoryChapter } from '../../content/nafasLanding';
import { useLocale } from '../../context/LocaleContext';

type JourneyStoryProps = {
  chapters: LandingStoryChapter[];
};

const storySceneMeta = {
  opening: {
    image: landingFragrances[0].image,
    chips: ['Fresh spark', 'Pink pepper', 'First spray'],
    chipsAr: ['شرارة أولى', 'فلفل وردي', 'ومضة فريش'],
  },
  heart: {
    image: landingFragrances[1].image,
    chips: ['Soft florals', 'Quiet body', 'Cotton musk'],
    chipsAr: ['زهور ناعمة', 'قلب هادئ', 'مسك قطني'],
  },
  trail: {
    image: landingFragrances[3].image,
    chips: ['Dark woods', 'Warm trace', 'Lasting musk'],
    chipsAr: ['أخشاب داكنة', 'أثر دافئ', 'مسك باقٍ'],
  },
} as const;

export default function JourneyStory({ chapters }: JourneyStoryProps) {
  const { locale } = useLocale();

  return (
    <section className="nlp-section nlp-section--story" aria-labelledby="journey-title">
      <div className="n-container">
        <div className="nlp-section-head nlp-section-head--wide">
          <div>
            <p className="nlp-eyebrow">{locale === 'ar' ? 'من أول رشة لآخر أثر' : 'From opening to trail'}</p>
            <h2 id="journey-title">{locale === 'ar' ? 'رحلة الرشة.' : 'The journey of a spray.'}</h2>
            <p>{locale === 'ar' ? 'العطر ليس لحظة واحدة… يبدأ، يهدأ، وبعدها يترك أثره.' : 'A perfume is not one moment. It opens, settles, and leaves a trace.'}</p>
          </div>
        </div>

        <div className="nlp-story" data-story-root>
          <div className="nlp-story__visual-shell">
            <div className="nlp-story__visual" data-story-visual>
              {chapters.map((chapter, index) => {
                const scene = storySceneMeta[chapter.id as keyof typeof storySceneMeta];

                return (
                  <div
                    key={chapter.id}
                    className={`nlp-story__visual-layer nlp-story__visual-layer--${chapter.id} ${index === 0 ? 'is-active' : ''}`}
                    data-story-visual-step={chapter.id}
                    aria-hidden="true"
                  >
                    <div className={`nlp-story__scene nlp-story__scene--${chapter.id}`}>
                      <div className="nlp-story__scene-bottle">
                        <span className="nlp-story__scene-cap" />
                        <span className="nlp-story__scene-glass" />
                        <span className="nlp-story__scene-liquid" />
                        <img className="nlp-story__scene-bottle-image" src={scene.image} alt="" loading="lazy" decoding="async" />
                      </div>
                      <div className="nlp-story__scene-glow" />
                      <div className="nlp-story__scene-mist">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="nlp-story__scene-notes">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="nlp-story__scene-orbit">
                        {(locale === 'ar' ? scene.chipsAr : scene.chips).map((chip) => (
                          <small key={`${chapter.id}-${chip}`}>{chip}</small>
                        ))}
                      </div>
                      <div className="nlp-story__scene-trail" />
                    </div>
                    <span>{locale === 'ar' ? chapter.visualLabelAr : chapter.visualLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="nlp-story__chapters" data-story-track>
            {chapters.map((chapter, index) => {
              const scene = storySceneMeta[chapter.id as keyof typeof storySceneMeta];

              return (
                <article
                  key={chapter.id}
                  className={`nlp-story__chapter ${index === 0 ? 'is-active' : ''}`}
                  data-story-step={chapter.id}
                >
                  <span className="nlp-story__chapter-index">{String(index + 1).padStart(2, '0')}</span>
                  <small className="nlp-story__chapter-kicker">{locale === 'ar' ? chapter.visualLabelAr : chapter.visualLabel}</small>
                  <h3>{locale === 'ar' ? chapter.titleAr : chapter.title}</h3>
                  <p>{locale === 'ar' ? chapter.bodyAr : chapter.body}</p>
                  <div className="nlp-story__chapter-tags">
                    {(locale === 'ar' ? scene.chipsAr : scene.chips).map((chip) => (
                      <small key={`${chapter.id}-tag-${chip}`}>{chip}</small>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

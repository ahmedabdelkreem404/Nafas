import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, chapterCopy, text } from '../data/appleHomeCopy';
import type { StoryChapter } from '../types';

type StoryChaptersSectionProps = {
  chapters: StoryChapter[];
};

export default function StoryChaptersSection({ chapters }: StoryChaptersSectionProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.chapters;

  return (
    <section className="anh-section anh-chapters" data-section={SECTION_LABELS.chapters} aria-labelledby="chapters-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="chapters-title">{text(copy.title, locale)}</h2>
        </div>
        <div className="anh-chapter-grid">
          {chapters.map((chapter, index) => {
            const chapterText = chapterCopy[chapter.id];

            return (
              <article key={chapter.id} className="anh-chapter">
                <img src={chapter.image} alt="" loading="lazy" decoding="async" />
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{text(chapterText.title, locale)}</h3>
                  <p>{text(chapterText.copy, locale)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { SECTION_LABELS } from '../constants';
import type { StoryChapter } from '../types';

type StoryChaptersSectionProps = {
  chapters: StoryChapter[];
};

export default function StoryChaptersSection({ chapters }: StoryChaptersSectionProps) {
  return (
    <section className="anh-section anh-chapters" data-section={SECTION_LABELS.chapters} aria-labelledby="chapters-title">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">Story chapters</p>
          <h2 id="chapters-title">رحلة الرشة.</h2>
        </div>
        <div className="anh-chapter-grid">
          {chapters.map((chapter, index) => (
            <article key={chapter.id} className="anh-chapter">
              <img src={chapter.image} alt="" loading="lazy" decoding="async" />
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

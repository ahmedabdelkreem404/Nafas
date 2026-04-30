import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BottleVisual from '../features/apple-home/components/BottleVisual';
import { scentCopy, text } from '../features/apple-home/data/appleHomeCopy';
import { scents } from '../features/apple-home/data/scents';
import type { Scent } from '../features/apple-home/types';
import { getLocalCoreProduct, localCoreProducts } from '../content/localProducts';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { getPrimaryVariant } from '../utils/products';

type Answer = 'men' | 'women' | 'morning' | 'night' | 'fresh' | 'dark' | 'soft' | 'coffee' | 'daily' | 'occasion' | 'safe' | 'bold';

const questions = [
  { id: 'gender', ar: 'رجالي ولا حريمي؟', en: 'Men or women?', answers: [['men', 'رجالي', 'Men'], ['women', 'حريمي', 'Women']] },
  { id: 'time', ar: 'صباح ولا ليل؟', en: 'Morning or night?', answers: [['morning', 'صباح', 'Morning'], ['night', 'ليل', 'Night']] },
  { id: 'mood', ar: 'فريش ولا غامق ولا ناعم؟', en: 'Fresh, dark, or soft?', answers: [['fresh', 'فريش', 'Fresh'], ['dark', 'غامق', 'Dark'], ['soft', 'ناعم', 'Soft']] },
  { id: 'coffee', ar: 'بتحب القهوة والدفا؟', en: 'Do you like coffee warmth?', answers: [['coffee', 'أيوه', 'Yes'], ['fresh', 'مش ضروري', 'Not really']] },
  { id: 'use', ar: 'عطر يومي ولا مناسبة؟', en: 'Daily or occasion?', answers: [['daily', 'يومي', 'Daily'], ['occasion', 'مناسبة', 'Occasion']] },
  { id: 'style', ar: 'اختيار آمن ولا ملفت؟', en: 'Safe or bold?', answers: [['safe', 'آمن', 'Safe'], ['bold', 'ملفت', 'Bold']] },
] as const;

const scentScores: Record<string, Partial<Record<Answer, number>>> = {
  sharara: { men: 3, fresh: 2, dark: 2, bold: 3, occasion: 2, night: 1 },
  madar: { men: 3, fresh: 3, morning: 2, daily: 3, safe: 2 },
  athar: { men: 3, dark: 3, night: 3, occasion: 3, bold: 2 },
  barq: { men: 2, coffee: 4, fresh: 1, night: 2, occasion: 2, bold: 2 },
  nada: { women: 3, fresh: 3, soft: 2, morning: 2, daily: 3, safe: 2 },
  ghayma: { women: 3, soft: 4, safe: 3, daily: 1, occasion: 1 },
};

const findVisual = (slug: string): Scent => scents.find((scent) => scent.id === slug) ?? scents[0];

export default function ScentFinder() {
  const { dir, locale } = useLocale();
  const { addToCart } = useCart();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const answered = Object.values(answers);

  const results = useMemo(() => {
    return [...localCoreProducts]
      .map((product) => ({
        product,
        score: answered.reduce((sum, answer) => sum + (scentScores[product.slug]?.[answer] || 0), 0),
      }))
      .sort((left, right) => right.score - left.score);
  }, [answered]);

  const primary = results[0]?.product || getLocalCoreProduct('sharara');
  const secondary = results[1]?.product || getLocalCoreProduct('madar');
  const primaryVisual = findVisual(primary?.slug || 'sharara');
  const secondaryVisual = findVisual(secondary?.slug || 'madar');
  const complete = Object.keys(answers).length === questions.length;

  const addPrimary = async () => {
    if (!primary) return;
    const variant = getPrimaryVariant(primary);
    if (variant) await addToCart(primary, variant, 1);
  };

  return (
    <div className={`apple-nafas-page apple-nafas-page--${locale} anh-commerce-page`} dir={dir} lang={locale}>
      <section className="anh-section anh-selector anh-commerce-hero">
        <div className="anh-container">
          <div className="anh-selector__panel anh-finder-panel">
            <div>
              <p className="anh-kicker">{locale === 'ar' ? 'اكتشف عطرك' : 'Scent Finder'}</p>
              <h1>{locale === 'ar' ? 'مش عارف تبدأ منين؟ خلّي نفس يرشّح لك عطرك.' : 'Not sure where to start? Let Nafas guide you.'}</h1>
              <p>{locale === 'ar' ? 'اختيارات بسيطة، ونتيجة واضحة من كولكشن نفس فقط.' : 'Simple choices and a clear recommendation from the Nafas collection.'}</p>
            </div>
            <div className="anh-finder-visual" aria-hidden="true">
              <BottleVisual scent={primaryVisual} />
              <BottleVisual scent={secondaryVisual} />
            </div>
          </div>
        </div>
      </section>

      <section className="anh-section anh-selector">
        <div className="anh-container anh-finder-grid">
          <div className="anh-selector__options anh-finder-questions">
            {questions.map((question) => (
              <article key={question.id} className="anh-finder-question">
                <strong>{locale === 'ar' ? question.ar : question.en}</strong>
                <div>
                  {question.answers.map(([value, ar, en]) => (
                    <button
                      key={`${question.id}-${value}`}
                      type="button"
                      className={answers[question.id] === value ? 'is-active' : ''}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: value as Answer }))}
                    >
                      {locale === 'ar' ? ar : en}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="anh-compare-card anh-finder-result">
            <div className="anh-compare-card__visual">
              <BottleVisual scent={primaryVisual} />
            </div>
            <span>{primaryVisual.name}</span>
            <h2>{text(scentCopy[primaryVisual.id].name, locale)}</h2>
            <p>{complete ? text(scentCopy[primaryVisual.id].heroDescription, locale) : (locale === 'ar' ? 'جاوب على الأسئلة كلها عشان النتيجة تبقى أدق.' : 'Answer all questions for a sharper result.')}</p>
            <div className="anh-actions">
              <button type="button" className="anh-button anh-button--primary" onClick={addPrimary}>{locale === 'ar' ? 'أضف الترشيح للسلة' : 'Add recommendation'}</button>
              <Link to="/discovery-set" className="anh-button anh-button--secondary">{locale === 'ar' ? 'مجموعة التجربة' : 'Discovery Set'}</Link>
            </div>
            {secondary ? <Link to={`/products/${secondary.slug}`} className="inline-link">{locale === 'ar' ? `اختيار قريب: ${secondary.name_ar}` : `Nearby pick: ${secondary.name_en}`}</Link> : null}
          </aside>
        </div>
      </section>
    </div>
  );
}

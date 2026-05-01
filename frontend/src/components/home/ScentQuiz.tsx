import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { landingFragrances, LANDING_WHATSAPP_URL, landingMedia } from '../../content/nafasLanding';
import { useLocale } from '../../context/LocaleContext';

type QuizValue = 'morning' | 'evening' | 'gift' | 'signature' | 'fresh' | 'soft' | 'warm' | 'dark' | 'calm' | 'noticeable' | 'deep' | 'gift-safe';

type QuizState = {
  timing?: QuizValue;
  mood?: QuizValue;
  strength?: QuizValue;
};

const quizOptions = {
  timing: [
    { id: 'morning', label: 'Morning', labelAr: 'الصبح' },
    { id: 'evening', label: 'Evening', labelAr: 'المساء' },
    { id: 'gift', label: 'Gift', labelAr: 'هدية' },
    { id: 'signature', label: 'Signature scent', labelAr: 'ريحة أساسية' },
  ],
  mood: [
    { id: 'fresh', label: 'Fresh', labelAr: 'فريش' },
    { id: 'soft', label: 'Soft', labelAr: 'ناعم' },
    { id: 'warm', label: 'Warm', labelAr: 'دافئ' },
    { id: 'dark', label: 'Dark', labelAr: 'غامض' },
  ],
  strength: [
    { id: 'calm', label: 'Calm', labelAr: 'هادئ' },
    { id: 'noticeable', label: 'Noticeable', labelAr: 'ملحوظ' },
    { id: 'deep', label: 'Deep', labelAr: 'عميق' },
    { id: 'gift-safe', label: 'Gift-safe', labelAr: 'مناسب للهدية' },
  ],
} as const;

function recommendFragrance(state: QuizState) {
  if (state.timing === 'morning' && state.mood === 'fresh') return 'sharara';
  if (state.timing === 'gift' && state.mood === 'soft') return 'ghayma';
  if (state.timing === 'evening' && state.mood === 'warm') return 'dafwa';
  if (state.timing === 'signature' || state.mood === 'dark' || state.strength === 'deep') return 'zell';
  return 'discovery';
}

export default function ScentQuiz() {
  const { locale } = useLocale();
  const [answers, setAnswers] = useState<QuizState>({});

  const recommendation = useMemo(() => {
    const id = recommendFragrance(answers);
    return landingFragrances.find((item) => item.id === id) ?? null;
  }, [answers]);

  const isComplete = Boolean(answers.timing && answers.mood && answers.strength);

  const resultCopy = useMemo(() => {
    if (!recommendation) {
      return {
        title: locale === 'ar' ? 'ابدأ بـ Discovery Mini' : 'Start with Discovery Mini',
        body: locale === 'ar'
          ? 'لسه محتار؟ جرّب الست روائح أولًا، وبعدها ارجع للزجاجة اللي ارتحت لها أكثر.'
          : 'Still undecided? Start with the six moods first, then return for the bottle that feels right.',
      };
    }

    if (recommendation.id === 'sharara') {
      return {
        title: locale === 'ar' ? 'ابدأ بشرارة' : 'Start with Sharara',
        body: locale === 'ar'
          ? 'فريش حار بطابع مسكي أغمق، مناسب لو تحب حضورًا يبان من أول رشة.'
          : 'Fresh spice with a darker musky trail for people who want presence from the first spray.',
      };
    }

    if (recommendation.id === 'ghayma') {
      return {
        title: locale === 'ar' ? 'ابدأ بغيمة' : 'Start with Ghayma',
        body: locale === 'ar'
          ? 'فاكهي ناعم ومسكي، مناسب للهدايا وللأيام الهادية الأنيقة.'
          : 'Soft fruity musk built for gifting and calm elegant days.',
      };
    }

    if (recommendation.id === 'dafwa') {
      return {
        title: locale === 'ar' ? 'ابدأ بدفوة' : 'Start with Dafwa',
        body: locale === 'ar'
          ? 'قهوة دافية وعمق شرقي حلو لليل، الشتاء، واللحظات الخاصة.'
          : 'Warm coffee and sweet oriental depth for evenings, cooler nights, and special moments.',
      };
    }

    return {
      title: locale === 'ar' ? 'ابدأ بظلّ' : 'Start with Zell',
      body: locale === 'ar'
        ? 'خشبي داكن ومسكي هادئ لذوق يحب العمق من غير دوشة.'
        : 'Dark woods and calm musk for a taste that prefers quiet depth.',
    };
  }, [locale, recommendation]);

  return (
    <section className="nlp-section nlp-section--quiz" id="finder" aria-labelledby="quiz-title">
      <div className="n-container">
        <div className="nlp-section-head nlp-section-head--wide">
          <div>
            <p className="nlp-eyebrow">{locale === 'ar' ? 'اختيار أسهل' : 'Intuitive by design'}</p>
            <h2 id="quiz-title">{locale === 'ar' ? 'اختيار العطر أسهل.' : 'Choosing your scent should feel easy.'}</h2>
            <p>{locale === 'ar' ? 'ثلاث اختيارات بسيطة تختصر عليك البداية، وتوصلك لأول تستر أقرب لذوقك.' : 'Three quick choices narrow the start and point you to the tester that fits your taste best.'}</p>
          </div>
        </div>

        <div className="nlp-quiz">
          <div className="nlp-quiz__questions">
            <div className="nlp-quiz__question">
              <h3>{locale === 'ar' ? 'هتلبسه إمتى؟' : 'When will you wear it?'}</h3>
              <div className="nlp-quiz__chips">
                {quizOptions.timing.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`nlp-quiz__chip ${answers.timing === option.id ? 'is-active' : ''}`}
                    onClick={() => setAnswers((state) => ({ ...state, timing: option.id as QuizValue }))}
                  >
                    {locale === 'ar' ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="nlp-quiz__question">
              <h3>{locale === 'ar' ? 'مودك إيه؟' : 'What mood do you prefer?'}</h3>
              <div className="nlp-quiz__chips">
                {quizOptions.mood.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`nlp-quiz__chip ${answers.mood === option.id ? 'is-active' : ''}`}
                    onClick={() => setAnswers((state) => ({ ...state, mood: option.id as QuizValue }))}
                  >
                    {locale === 'ar' ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="nlp-quiz__question">
              <h3>{locale === 'ar' ? 'تحب حضوره قد إيه؟' : 'How present do you like it to feel?'}</h3>
              <div className="nlp-quiz__chips">
                {quizOptions.strength.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`nlp-quiz__chip ${answers.strength === option.id ? 'is-active' : ''}`}
                    onClick={() => setAnswers((state) => ({ ...state, strength: option.id as QuizValue }))}
                  >
                    {locale === 'ar' ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="nlp-quiz__result" aria-live="polite">
            <div className="nlp-quiz__visual">
              <img
                src={recommendation?.image ?? landingMedia.discoveryImage}
                alt={recommendation ? (locale === 'ar' ? recommendation.nameAr : recommendation.name) : 'Discovery Mini'}
                loading="lazy"
                decoding="async"
              />
            </div>

            <span className="nlp-eyebrow">{locale === 'ar' ? 'الاقتراح' : 'Recommendation'}</span>
            <h3>{resultCopy.title}</h3>
            <p>{resultCopy.body}</p>

            {recommendation ? (
              <Link to={`/products/${recommendation.slug}`} className="n-btn n-btn--primary">
                {locale === 'ar' ? `استكشف ${recommendation.nameAr}` : `Explore ${recommendation.name}`}
              </Link>
            ) : (
              <a
                className="n-btn n-btn--primary"
                href={`${LANDING_WHATSAPP_URL}?text=${encodeURIComponent(locale === 'ar' ? 'أريد طلب Discovery Mini من Nafas' : 'I want to order the Nafas Discovery Mini')}`}
                target="_blank"
                rel="noreferrer"
              >
                {locale === 'ar' ? 'اطلب Discovery Mini' : 'Order Discovery Mini'}
              </a>
            )}

            {!isComplete ? (
              <small>{locale === 'ar' ? 'جاوب على الثلاث أسئلة، أو ابدأ بـ Discovery Mini لو لسه محتار.' : 'Answer the three prompts, or start with the Discovery Mini if you want the safest first step.'}</small>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

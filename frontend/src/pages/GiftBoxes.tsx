import { Link } from 'react-router-dom';
import BottleVisual from '../features/apple-home/components/BottleVisual';
import { scentCopy, text } from '../features/apple-home/data/appleHomeCopy';
import { scents } from '../features/apple-home/data/scents';
import { useLocale } from '../context/LocaleContext';

export default function GiftBoxes() {
  const { dir, locale } = useLocale();
  const sharara = scents.find((scent) => scent.id === 'sharara') ?? scents[0];
  const nada = scents.find((scent) => scent.id === 'nada') ?? scents[0];
  const ghayma = scents.find((scent) => scent.id === 'ghayma') ?? scents[0];

  const boxes = [
    {
      title: locale === 'ar' ? 'هدية رجالية' : 'Men gift edit',
      body: locale === 'ar' ? 'شرارة 30ml كنقطة حضور واضحة، أو مجموعة التجربة لو الاختيار محتاج مساحة.' : 'Sharara 30ml as the bold anchor, or Discovery Set when the choice needs room.',
      href: '/products/sharara',
      scent: sharara,
    },
    {
      title: locale === 'ar' ? 'هدية ناعمة' : 'Soft gift edit',
      body: locale === 'ar' ? 'ندى وغيمة لاختيارات أنثوية هادئة، مناسبة للهدايا اليومية والمناسبات القريبة.' : 'Nada and Ghayma for calm feminine gifting and close occasions.',
      href: '/products/ghayma',
      scent: ghayma,
    },
    {
      title: locale === 'ar' ? 'اختيار آمن' : 'Clear first gift',
      body: locale === 'ar' ? 'مجموعة التجربة مناسبة لو مش عارف ذوق الشخص بدقة، وتفضل جزء أنيق من التجربة.' : 'Discovery Set works when you do not know the recipient’s exact taste.',
      href: '/discovery-set',
      scent: nada,
    },
  ];

  return (
    <div className={`apple-nafas-page apple-nafas-page--${locale} anh-commerce-page`} dir={dir} lang={locale}>
      <section className="anh-section anh-together">
        <div className="anh-container anh-together__grid">
          <div>
            <p className="anh-kicker">{locale === 'ar' ? 'الهدايا' : 'Gifting'}</p>
            <h1>{locale === 'ar' ? 'هدية ريحتها هادية واختيارها واضح.' : 'Gifts with a calmer scent decision.'}</h1>
            <p>{locale === 'ar' ? 'اختيارات جاهزة داخل نفس اللغة البصرية: رجالي، ناعم، أو مجموعة تجربة لمن لم يستقر على ذوق محدد.' : 'Ready edits in the Nafas visual language: masculine, soft, or discovery-led.'}</p>
            <div className="anh-actions">
              <Link to="/discovery-set" className="anh-button anh-button--primary">{locale === 'ar' ? 'مجموعة التجربة' : 'Discovery Set'}</Link>
              <Link to="/scent-finder" className="anh-button anh-button--secondary">{locale === 'ar' ? 'اكتشف عطرك' : 'Scent Finder'}</Link>
            </div>
          </div>
          <div className="anh-together__visual" aria-hidden="true">
            <img src="/assets/stock/optimized/fragrance-spray-moment.webp" alt="" loading="lazy" decoding="async" />
            <BottleVisual scent={sharara} />
          </div>
        </div>
      </section>

      <section className="anh-section anh-compare">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">{locale === 'ar' ? 'اختيارات الهدايا' : 'Gift edits'}</p>
            <h2>{locale === 'ar' ? 'اختار بهدوء.' : 'Choose calmly.'}</h2>
          </div>
          <div className="anh-compare__grid anh-gift-grid">
            {boxes.map((box) => (
              <article key={box.title} className="anh-compare-card">
                <div className="anh-compare-card__visual">
                  <BottleVisual scent={box.scent} />
                </div>
                <span>{box.scent.name}</span>
                <h3>{box.title}</h3>
                <p>{box.body}</p>
                <p>{text(scentCopy[box.scent.id].gift, locale)}</p>
                <Link to={box.href} className="anh-button anh-button--secondary">{locale === 'ar' ? 'شاهد الاختيار' : 'View edit'}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

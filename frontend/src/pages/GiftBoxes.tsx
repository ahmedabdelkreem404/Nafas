import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { DiscoverySetCTA, ScentStoryBlock } from '../components/sensory/SensoryPrimitives';

export default function GiftBoxes() {
  const { locale } = useLocale();

  const boxes = [
    {
      title: locale === 'ar' ? 'هدية رجالية' : 'Men gift edit',
      body: locale === 'ar' ? 'شرارة كبداية لافتة، ومعاها مجموعة التجربة لو الهدية محتاجة اختيار أهدأ.' : 'Sharara as the bold anchor, with Discovery Set when the choice needs room.',
      href: '/products/sharara',
    },
    {
      title: locale === 'ar' ? 'هدية ناعمة' : 'Soft gift edit',
      body: locale === 'ar' ? 'ندى وغيمة لاختيارات أنثوية هادئة، مناسبة للهدايا اليومية والمناسبات القريبة.' : 'Nada and Ghayma for calm feminine gifting and close occasions.',
      href: '/products/ghayma',
    },
    {
      title: locale === 'ar' ? 'اختيار آمن' : 'Safer first gift',
      body: locale === 'ar' ? 'مجموعة التجربة مناسبة لو مش عارف ذوق الشخص بدقة.' : 'Discovery Set works when you do not know the recipient’s exact taste.',
      href: '/discovery-set',
    },
  ];

  return (
    <div className="n-container n-section gift-boxes-page">
      <div className="page-head">
        <small>{locale === 'ar' ? 'الهدايا' : 'Gifting'}</small>
        <h1>{locale === 'ar' ? 'هدية ريحتها هادية واختيارها واضح.' : 'Gifts with a calmer scent decision.'}</h1>
        <p>{locale === 'ar' ? 'في الإصدار الأول، الهدايا هنا ترشيحات جاهزة تربطك بالمنتج المناسب بدون تعقيد باقات غير مدعومة.' : 'For v1, gifting is presented as guided edits that route to supported products without unsupported bundle logic.'}</p>
      </div>

      <div className="gift-grid">
        {boxes.map((box) => (
          <ScentStoryBlock key={box.title} eyebrow={locale === 'ar' ? 'اقتراح هدية' : 'Gift idea'} title={box.title} body={box.body} />
        ))}
      </div>

      <div className="gift-actions">
        {boxes.map((box) => (
          <Link key={box.href} to={box.href} className="n-btn n-btn--ghost">{box.title}</Link>
        ))}
      </div>

      <DiscoverySetCTA locale={locale} />
    </div>
  );
}

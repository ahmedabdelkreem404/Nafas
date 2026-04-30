import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import Reveal from '../components/Reveal';
import { getContentPageCopy } from '../content/publicCopy';
import { useLocale } from '../context/LocaleContext';

const policySlugs = new Set(['privacy-policy', 'return-policy', 'terms']);

export default function ContentPage() {
  const { pathname } = useLocation();
  const { locale } = useLocale();
  const slug = pathname.replace(/^\//, '') || 'about';
  const fallback = getContentPageCopy(slug, locale);
  const defaultTitle = fallback.sections[0]?.title || slug;
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState<string[]>(fallback.sections.map((section) => `${section.title}\n${section.body}`));

  useEffect(() => {
    publicApi.getPage(slug).then((response) => {
      const page = response.data.data || response.data.page || response.data;
      if (!page) return;
      setTitle(page.title || defaultTitle);
      if (page.content) {
        const blocks = String(page.content).split(/\n{2,}/).filter(Boolean);
        setBody(blocks.length ? blocks : [String(page.content)]);
      }
    }).catch(() => {
      setTitle(defaultTitle);
      setBody(fallback.sections.map((section) => `${section.title}\n${section.body}`));
    });
  }, [defaultTitle, fallback.sections, slug]);

  return (
    <div className="n-container n-section content-page">
      <Reveal className="content-head">
        <small>نفَس</small>
        <h1>{title}</h1>
        <p>{fallback.hero}</p>
      </Reveal>

      <Reveal className="content-prose">
        {body.map((block, index) => {
          const [heading, ...rest] = block.split('\n');
          return (
            <section key={index}>
              <h2>{heading}</h2>
              <p>{rest.join(' ')}</p>
            </section>
          );
        })}
      </Reveal>

      {policySlugs.has(slug) ? (
        <Reveal className="content-note">
          <p>{locale === 'ar' ? 'الصياغة القانونية النهائية يجب مراجعتها قبل الإطلاق الرسمي.' : 'Final legal wording should be reviewed before official launch.'}</p>
        </Reveal>
      ) : null}

      <Reveal className="content-cta-bridge">
        <div>
          <small>{locale === 'ar' ? 'اكتشف المجموعة' : 'Continue exploring'}</small>
          <h2>{locale === 'ar' ? 'إذا انتهت القراءة، ابدأ من الرائحة.' : 'Once the reading ends, begin with the scent.'}</h2>
        </div>
        <Link to="/shop" className="n-btn n-btn--primary">{locale === 'ar' ? 'اذهب إلى المتجر' : 'Go to shop'}</Link>
      </Reveal>
    </div>
  );
}

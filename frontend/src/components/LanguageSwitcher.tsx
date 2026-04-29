import React from 'react';
import { useLocale } from '../context/LocaleContext';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="language-switcher" role="group" aria-label="Language switcher">
      <button type="button" className={`language-switcher__button ${locale === 'ar' ? 'is-active' : ''}`} onClick={() => setLocale('ar')}>
        ع
      </button>
      <button type="button" className={`language-switcher__button ${locale === 'en' ? 'is-active' : ''}`} onClick={() => setLocale('en')}>
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

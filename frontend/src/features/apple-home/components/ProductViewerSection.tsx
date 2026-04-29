import type { CSSProperties } from 'react';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS, viewerTabs } from '../constants';
import { appleHomeCopy, scentCopy, text, viewerTabCopy } from '../data/appleHomeCopy';
import { useProductViewer } from '../hooks/useProductViewer';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type ProductViewerSectionProps = {
  scents: Scent[];
};

export default function ProductViewerSection({ scents }: ProductViewerSectionProps) {
  const { locale } = useLocale();
  const viewer = useProductViewer(scents, locale);
  const copy = appleHomeCopy.viewer;
  const activeCopy = scentCopy[viewer.activeScent.id];

  return (
    <section className="anh-section anh-viewer" data-section={SECTION_LABELS.viewer} aria-labelledby="viewer-title" data-proof="viewer">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="viewer-title">{text(copy.title, locale)}</h2>
        </div>

        <div className="anh-viewer-panel" style={{ '--accent': viewer.activeScent.accent } as CSSProperties}>
          <div className="anh-viewer-panel__controls" aria-label={text(copy.scentControls, locale)}>
            {scents.map((scent) => (
              <button
                key={scent.id}
                type="button"
                className={viewer.selectedScentId === scent.id ? 'is-active' : ''}
                onClick={() => viewer.selectScent(scent.id)}
                aria-pressed={viewer.selectedScentId === scent.id}
              >
                {text(scentCopy[scent.id].name, locale)}
              </button>
            ))}
          </div>

          <div className="anh-viewer-panel__visual">
            <div className="anh-viewer-panel__halo" />
            <BottleVisual key={viewer.activeScent.id} scent={viewer.activeScent} />
          </div>

          <div className="anh-viewer-panel__copy" aria-live="polite">
            <span>{viewer.activeScent.name}</span>
            <h3>{text(activeCopy.name, locale)}</h3>
            <p data-testid="viewer-copy">{viewer.activeCopy}</p>
            <div className="anh-viewer-panel__tabs" aria-label={text(copy.details, locale)}>
              {viewerTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={viewer.selectedTab === tab.id ? 'is-active' : ''}
                  onClick={() => viewer.setSelectedTab(tab.id)}
                  aria-pressed={viewer.selectedTab === tab.id}
                >
                  {text(viewerTabCopy[tab.id], locale)}
                </button>
              ))}
            </div>
            <a className="anh-button anh-button--primary" href="#tester-path">{text(copy.cta, locale)}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

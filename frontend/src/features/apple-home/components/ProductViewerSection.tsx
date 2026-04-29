import type { CSSProperties } from 'react';
import { SECTION_LABELS, viewerTabs } from '../constants';
import { useProductViewer } from '../hooks/useProductViewer';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type ProductViewerSectionProps = {
  scents: Scent[];
};

export default function ProductViewerSection({ scents }: ProductViewerSectionProps) {
  const viewer = useProductViewer(scents);

  return (
    <section className="anh-section anh-viewer" data-section={SECTION_LABELS.viewer} aria-labelledby="viewer-title" data-proof="viewer">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">Product viewer</p>
          <h2 id="viewer-title">خذ نظرة أقرب.</h2>
        </div>

        <div className="anh-viewer-panel" style={{ '--accent': viewer.activeScent.accent } as CSSProperties}>
          <div className="anh-viewer-panel__controls" aria-label="اختيار الرائحة">
            {scents.map((scent) => (
              <button
                key={scent.id}
                type="button"
                className={viewer.selectedScentId === scent.id ? 'is-active' : ''}
                onClick={() => viewer.selectScent(scent.id)}
                aria-pressed={viewer.selectedScentId === scent.id}
              >
                {scent.nameAr}
              </button>
            ))}
          </div>

          <div className="anh-viewer-panel__visual">
            <div className="anh-viewer-panel__halo" />
            <BottleVisual key={viewer.activeScent.id} scent={viewer.activeScent} />
          </div>

          <div className="anh-viewer-panel__copy" aria-live="polite">
            <span>{viewer.activeScent.name}</span>
            <h3>{viewer.activeScent.nameAr}</h3>
            <p data-testid="viewer-copy">{viewer.activeCopy}</p>
            <div className="anh-viewer-panel__tabs" aria-label="تفاصيل العطر">
              {viewerTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={viewer.selectedTab === tab.id ? 'is-active' : ''}
                  onClick={() => viewer.setSelectedTab(tab.id)}
                  aria-pressed={viewer.selectedTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <a className="anh-button anh-button--primary" href="#tester-path">ابدأ بتستر</a>
          </div>
        </div>
      </div>
    </section>
  );
}

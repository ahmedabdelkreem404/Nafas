import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createScrollScrubVideo, SCROLL_SCRUB_DESKTOP_DISTANCE } from '../animations/scrollScrubVideo';
import { getPublicCopy } from '../content/publicCopy';
import { useLocale } from '../context/LocaleContext';
import { JOURNEY_POSTER, JOURNEY_VIDEO_MP4, JOURNEY_VIDEO_WEBM } from '../utils/brand';
import { cx } from './ui';

const MOBILE_QUERY = '(max-width: 767px)';

const ScrollScrubPerfumeVideo: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const { locale } = useLocale();
  const copy = getPublicCopy(locale);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRefs = useRef<Array<HTMLElement | null>>([]);

  const [activeStage, setActiveStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [videoStatus, setVideoStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const stages = useMemo(() => copy.journey.stages, [copy.journey.stages]);
  const activeStageCopy = stages[activeStage] || stages[0];

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const updateMobileState = () => setIsMobile(media.matches);

    updateMobileState();
    media.addEventListener('change', updateMobileState);

    return () => media.removeEventListener('change', updateMobileState);
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (isMobile || reducedMotion || videoStatus !== 'ready') {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isMobile, reducedMotion, videoStatus]);

  useLayoutEffect(() => {
    if (reducedMotion || isMobile || videoStatus !== 'ready' || !sectionRef.current || !trackRef.current || !videoRef.current) {
      return;
    }

    const context = createScrollScrubVideo({
      container: sectionRef.current,
      onStageChange: setActiveStage,
      stageElements: stageRefs.current.filter((stageElement): stageElement is HTMLElement => Boolean(stageElement)),
      track: trackRef.current,
      video: videoRef.current,
    });

    return () => context.revert();
  }, [isMobile, locale, reducedMotion, videoStatus]);

  const isInteractiveDesktop = !reducedMotion && !isMobile && videoStatus === 'ready';
  const showVideoCard = videoStatus === 'ready' && !reducedMotion;
  const showFallbackTimeline = videoStatus === 'error' || reducedMotion;

  return (
    <section
      ref={sectionRef}
      className={cx(
        'scroll-scrub-perfume-video',
        isInteractiveDesktop && 'is-interactive',
        isMobile && 'is-mobile',
        showFallbackTimeline && 'has-fallback-timeline',
      )}
      data-scroll-video-shell
      data-scroll-video-mode={isInteractiveDesktop ? 'scrubbed' : showVideoCard ? 'card' : 'poster'}
      data-scroll-length={SCROLL_SCRUB_DESKTOP_DISTANCE}
    >
      <div className="scroll-scrub-perfume-video__aurora" aria-hidden="true" />
      <div className="scroll-scrub-perfume-video__mist" data-scroll-video-mist="one" aria-hidden="true" />
      <div className="scroll-scrub-perfume-video__mist" data-scroll-video-mist="two" aria-hidden="true" />

      <div ref={trackRef} className="container-wide scroll-scrub-perfume-video__layout" data-scroll-video-track>
        <div className="scroll-scrub-perfume-video__media-column">
          <div className="scroll-scrub-perfume-video__media-frame" data-scroll-video-frame data-journey-main-visual>
            <div className="scroll-scrub-perfume-video__media-glow" data-scroll-video-glow aria-hidden="true" />

            {videoStatus !== 'error' ? (
              <>
                <video
                  ref={videoRef}
                  className="scroll-scrub-perfume-video__media"
                  data-scroll-video-element
                  preload="auto"
                  muted
                  playsInline
                  poster={JOURNEY_POSTER}
                  onError={() => setVideoStatus('error')}
                  onLoadedMetadata={() => {
                    if ((videoRef.current?.duration || 0) > 0 && (videoRef.current?.readyState || 0) >= 2) {
                      setVideoStatus('ready');
                    }
                  }}
                  onLoadedData={() => {
                    if ((videoRef.current?.duration || 0) > 0) {
                      setVideoStatus('ready');
                    }
                  }}
                >
                  <source data-scroll-video-source src={JOURNEY_VIDEO_WEBM} type="video/webm" />
                  <source data-scroll-video-source src={JOURNEY_VIDEO_MP4} type="video/mp4" />
                </video>
                <div className="scroll-scrub-perfume-video__media-overlay" aria-hidden="true" />
              </>
            ) : (
              <>
                <img
                  className="scroll-scrub-perfume-video__media scroll-scrub-perfume-video__media--poster"
                  data-scroll-video-fallback
                  src={JOURNEY_POSTER}
                  alt={copy.journey.title}
                />
                <div className="scroll-scrub-perfume-video__media-overlay" aria-hidden="true" />
              </>
            )}

            <div className="scroll-scrub-perfume-video__media-badge" aria-live="polite">
              <span>{videoStatus === 'error' ? copy.journey.fallbackLabel : `${activeStage + 1}`.padStart(2, '0')}</span>
              <strong>{activeStageCopy?.title}</strong>
            </div>

            {videoStatus === 'loading' && !reducedMotion ? (
              <div className="scroll-scrub-perfume-video__loading">
                <span className="luxury-kicker">{copy.journey.kicker}</span>
                <p>{copy.journey.loadingLabel}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="scroll-scrub-perfume-video__copy-column">
          <div className="scroll-scrub-perfume-video__copy-shell">
            <span className="luxury-kicker">{copy.journey.kicker}</span>
            <h2>{copy.journey.title}</h2>
            <p>{copy.journey.intro}</p>

            {isInteractiveDesktop ? (
              <>
                <article className="scroll-scrub-perfume-video__active-stage">
                  <span className="scroll-scrub-perfume-video__stage-index">0{activeStage + 1}</span>
                  <h3>{activeStageCopy?.title}</h3>
                  <p>{activeStageCopy?.body}</p>
                </article>

                <div className="scroll-scrub-perfume-video__stage-rail" aria-hidden="true">
                  {stages.map((stage, index) => (
                    <div
                      key={`${stage.title}-rail`}
                      ref={(element) => {
                        stageRefs.current[index] = element;
                      }}
                      className={cx('scroll-scrub-perfume-video__rail-item', index === activeStage && 'is-active')}
                      data-scroll-stage
                      data-stage-index={index}
                      data-scroll-stage-rail-item
                    >
                      <span>0{index + 1}</span>
                      <small>{stage.title}</small>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="scroll-scrub-perfume-video__stack">
                {stages.map((stage, index) => (
                  <article
                    key={stage.title}
                    ref={(element) => {
                      stageRefs.current[index] = element;
                    }}
                    className={cx('scroll-scrub-perfume-video__stage-card', 'is-static', index === activeStage && 'is-active')}
                    data-scroll-stage
                    data-stage-index={index}
                  >
                    <span className="scroll-scrub-perfume-video__stage-index">0{index + 1}</span>
                    <h3>{stage.title}</h3>
                    <p>{stage.body}</p>
                  </article>
                ))}
              </div>
            )}

            <Link to="/shop" className="ui-button ui-button--primary ui-button--lg scroll-scrub-perfume-video__cta">
              {copy.journey.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollScrubPerfumeVideo;

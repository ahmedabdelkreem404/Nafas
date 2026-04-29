import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureScrollTrigger } from './homeAnimations';

export const SCROLL_SCRUB_DESKTOP_DISTANCE = 4200;

type ScrollScrubVideoOptions = {
  container: HTMLElement;
  stageElements: HTMLElement[];
  track: HTMLElement;
  video: HTMLVideoElement;
  onProgress?: (progress: number) => void;
  onStageChange?: (index: number) => void;
};

export function createScrollScrubVideo({
  container,
  onProgress,
  onStageChange,
  stageElements,
  track,
  video,
}: ScrollScrubVideoOptions) {
  ensureScrollTrigger();

  return gsap.context(() => {
    const stageCount = stageElements.length || 1;

    const setStage = (progress: number) => {
      const nextStageIndex = Math.min(stageCount - 1, Math.floor(gsap.utils.clamp(0, 0.999999, progress) * stageCount));

      stageElements.forEach((stageElement, index) => {
        stageElement.classList.toggle('is-active', index === nextStageIndex);
      });

      onStageChange?.(nextStageIndex);
    };

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: track,
        start: 'top top',
        end: `+=${SCROLL_SCRUB_DESKTOP_DISTANCE}`,
        scrub: 0.9,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = gsap.utils.clamp(0, 1, self.progress);
          const nextTime = video.duration ? progress * video.duration : 0;
          container.style.setProperty('--journey-progress', progress.toFixed(4));
          container.dataset.scrollProgress = progress.toFixed(4);

          if (video.duration) {
            video.currentTime = nextTime;
          }

          video.dataset.scrubTime = nextTime.toFixed(4);

          setStage(progress);
          onProgress?.(progress);
        },
      },
    });

    timeline
      .to(container, { '--journey-glow-shift': 1, duration: 1 }, 0)
      .fromTo('[data-scroll-video-mist="one"]', { xPercent: -8, autoAlpha: 0.2 }, { xPercent: 10, autoAlpha: 0.42, duration: 1 }, 0)
      .fromTo('[data-scroll-video-mist="two"]', { xPercent: 6, autoAlpha: 0.18 }, { xPercent: -12, autoAlpha: 0.38, duration: 1 }, 0)
      .fromTo('[data-scroll-video-frame]', { y: 16 }, { y: -16, duration: 1 }, 0)
      .fromTo('[data-scroll-video-glow]', { scale: 0.92, autoAlpha: 0.32 }, { scale: 1.08, autoAlpha: 0.6, duration: 1 }, 0);

    setStage(0);
    ScrollTrigger.refresh();
  }, container);
}

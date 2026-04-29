import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

function ensureLandingPlugins() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export function createLandingAnimations(root: HTMLElement, reducedMotion: boolean) {
  ensureLandingPlugins();

  return gsap.context(() => {
    gsap.fromTo('[data-ribbon]', { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    gsap.fromTo('[data-hero-visual]', { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power3.out' });
    gsap.fromTo('[data-hero-headline]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', delay: 0.12 });
    gsap.fromTo('[data-hero-copy]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.28 });
    gsap.fromTo('[data-hero-cta]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.78, ease: 'power3.out', delay: 0.42, stagger: 0.12 });

    if (reducedMotion) {
      return;
    }

    gsap.to('[data-hero-content]', {
      y: -60,
      autoAlpha: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-landing-hero]',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    const storySteps = gsap.utils.toArray<HTMLElement>('[data-story-step]');
    storySteps.forEach((step, index) => {
      const storyId = step.dataset.storyStep;

      ScrollTrigger.create({
        trigger: step,
        start: 'top center+=60',
        end: 'bottom center',
        onToggle: ({ isActive }) => {
          step.classList.toggle('is-active', isActive);

          if (!storyId) {
            return;
          }

          document.querySelectorAll<HTMLElement>('[data-story-visual-step]').forEach((layer) => {
            layer.classList.toggle('is-active', layer.dataset.storyVisualStep === storyId && isActive);
          });
        },
      });

      if (index === 0) {
        step.classList.add('is-active');
      }
    });

    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': () => {
        gsap.fromTo('[data-ritual-media]', { scale: 1.06 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-ritual-section]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        gsap.fromTo('[data-ritual-copy]', { autoAlpha: 0.12, y: 34 }, {
          autoAlpha: 1,
          y: 0,
          scrollTrigger: {
            trigger: '[data-ritual-section]',
            start: 'top 72%',
            end: 'top 34%',
            scrub: 0.8,
          },
        });
      },
    });
  }, root);
}

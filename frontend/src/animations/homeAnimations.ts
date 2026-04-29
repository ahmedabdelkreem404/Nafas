import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export const ensureScrollTrigger = () => {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
};

export const createHeroIntro = (container: HTMLElement) => {
  ensureScrollTrigger();
  return gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .fromTo('[data-hero-media]', { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0)
      .fromTo('[data-hero-panel]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.95 }, 0.18)
      .fromTo('[data-hero-headline]', { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.32)
      .fromTo('[data-hero-copy]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.5)
      .fromTo('[data-hero-cta]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.12 }, 0.64)
      .fromTo('[data-mist-layer]', { xPercent: -3, autoAlpha: 0.2 }, { xPercent: 3, autoAlpha: 1, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' }, 0.1);
  }, container);
};

export const createJourneyTimeline = (container: HTMLElement, reducedMotion: boolean) => {
  ensureScrollTrigger();
  if (reducedMotion) {
    return gsap.context(() => {}, container);
  }

  return gsap.context(() => {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '[data-journey-track]',
        start: 'top top',
        end: '+=3600',
        scrub: 1.15,
        pin: true,
        anticipatePin: 1,
      },
    })
      .fromTo('[data-journey-shell]', { background: 'linear-gradient(180deg, rgba(6,7,9,0.98), rgba(13,10,15,0.94))' }, { background: 'linear-gradient(180deg, rgba(11,8,7,0.98), rgba(45,24,11,0.92))', duration: 1 }, 0)
      .fromTo('[data-bottle-glass]', { autoAlpha: 0, scaleY: 0.6, transformOrigin: '50% 100%' }, { autoAlpha: 1, scaleY: 1, duration: 0.8 }, 0.05)
      .fromTo('[data-bottle-liquid]', { autoAlpha: 0, scaleY: 0.1, transformOrigin: '50% 100%' }, { autoAlpha: 0.95, scaleY: 1, duration: 0.7 }, 0.18)
      .fromTo('[data-bottle-label]', { autoAlpha: 0, scaleX: 0.8 }, { autoAlpha: 1, scaleX: 1, duration: 0.6 }, 0.32)
      .fromTo('[data-bottle-cap]', { yPercent: -42, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7 }, 0.44)
      .fromTo('[data-bottle-atomizer]', { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.55 }, 0.55)
      .to('[data-bottle-assembly]', { rotate: 16, duration: 0.8 }, 0.65)
      .to('[data-bottle-cap]', { yPercent: -36, xPercent: -8, rotate: -10, duration: 0.7 }, 0.78)
      .fromTo('[data-bottle-mist]', { autoAlpha: 0, scaleX: 0.3, scaleY: 0.4, xPercent: -10 }, { autoAlpha: 1, scaleX: 1, scaleY: 1, xPercent: 0, duration: 0.7 }, 0.84)
      .fromTo('[data-note-chip]', { autoAlpha: 0, y: 30, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.12 }, 0.92)
      .to('[data-journey-cta]', { autoAlpha: 1, y: 0, duration: 0.45 }, 1.02);

    gsap.utils.toArray<HTMLElement>('[data-journey-step]').forEach((step, index) => {
      gsap.fromTo(step, { autoAlpha: index === 0 ? 1 : 0.18, y: index === 0 ? 0 : 24 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        scrollTrigger: {
          trigger: '[data-journey-track]',
          start: `top+=${index * 360} top+=120`,
          end: `top+=${index * 360 + 260} top+=120`,
          scrub: true,
        },
      });
    });
  }, container);
};

export const createBentoReveal = (container: HTMLElement) => {
  ensureScrollTrigger();
  return gsap.context(() => {
    gsap.fromTo('[data-bento-card]', { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
      },
    });
  }, container);
};

import { useEffect, useRef } from 'react';

type Particle = {
  color: string;
  decay: number;
  life: number;
  opacity: number;
  radius: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

const COLORS = [
  'rgba(200, 158, 76,',
  'rgba(192, 120, 40,',
  'rgba(180, 130, 100,',
  'rgba(196, 144, 152,',
] as const;

export default function AtelierBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const prefersReducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canvas || prefersReducedMotion) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let running = true;
    const particles: Particle[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: height + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.18 + Math.random() * 0.28),
      radius: 60 + Math.random() * 120,
      opacity: 0.04 + Math.random() * 0.07,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
      decay: 0.0008 + Math.random() * 0.0006,
    });

    const draw = () => {
      if (!running) {
        return;
      }

      ctx.clearRect(0, 0, width, height);

      while (particles.length < 14) {
        particles.push(spawn());
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;

        if (particle.life <= 0 || particle.y < -particle.radius * 2) {
          particles.splice(index, 1);
          continue;
        }

        const alpha = particle.opacity * particle.life;
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
        gradient.addColorStop(0, `${particle.color}${alpha.toFixed(3)})`);
        gradient.addColorStop(1, `${particle.color}0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) {
        cancelAnimationFrame(raf);
      }
      running = true;
      draw();
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
        return;
      }

      start();
    };

    resize();
    for (let index = 0; index < 14; index += 1) {
      const particle = spawn();
      particle.y = Math.random() * height;
      particle.life = Math.max(0.25, Math.random());
      particles.push(particle);
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      />
      <div aria-hidden="true" className="atelier-bg-layers" />
    </>
  );
}

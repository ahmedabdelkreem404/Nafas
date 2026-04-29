import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) {
      return;
    }

    const dot = document.createElement('span');
    const ring = document.createElement('span');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      window.cancelAnimationFrame(frame);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}

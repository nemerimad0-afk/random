import confetti from 'canvas-confetti';

/**
 * Triggers lavish golden and navy celebratory confetti cannons and fireworks
 */
export const triggerGrandCelebration = () => {
  // Palette: Gold, deep navy, champagne, amber, crisp white
  const colors = ['#F5C042', '#FFF3BF', '#BF8415', '#FF7A00', '#1E3A8A', '#FFFFFF'];

  // 1. Initial explosive center blast
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    ticks: 300,
    gravity: 0.8,
    scalar: 1.2,
  });

  // 2. Left and Right stadium cannons
  const end = Date.now() + 2500;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();

  // 3. Falling golden stars
  setTimeout(() => {
    confetti({
      particleCount: 45,
      spread: 120,
      origin: { y: 0.3 },
      colors: ['#FFE894', '#F5BE38', '#E5A93C'],
      shapes: ['star'],
      scalar: 1.4,
    });
  }, 400);
};

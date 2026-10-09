'use strict';
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  if (navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4)) root.dataset.effects = 'quiet';
  const scenes = [...document.querySelectorAll('.ambient-scene, .ticker')];
  const visibleScenes = new Set();
  const updateScenes = () => scenes.forEach(scene => scene.classList.toggle('motion-active', !document.hidden && !reduced.matches && visibleScenes.has(scene)));
  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visibleScenes.add(entry.target) : visibleScenes.delete(entry.target));
      updateScenes();
    });
    scenes.forEach(scene => sceneObserver.observe(scene));
  }
  document.addEventListener('visibilitychange', updateScenes);
  reduced.addEventListener('change', updateScenes);

  // Content stays visible without JavaScript. Reveal once, then stop observing.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.hero-copy, .hero-art .art-card, .section-heading, .game-panel, .phase-tabs button, .role-card, .shot, .collage-art, .limitly-feature, .limitly-invitation, .limitly-banner, .download-copy');
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        reveal.unobserve(entry.target);
      }
    }), {rootMargin: '0px 0px 20px 0px', threshold: .06});
    targets.forEach(element => {
      // Visible entry delays are capped, even on the 36-role archive.
      const siblings = [...element.parentElement.children];
      element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element) % 4, 3) * 85}ms`);
      if (element.matches('.game-panel, .art-card, .role-card, .shot, .phase-tabs button, .limitly-feature, .limitly-invitation')) element.classList.add('reveal-from-right');
      element.classList.add('scroll-reveal');
      reveal.observe(element);
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) { reveal.disconnect(); targets.forEach(element => element.classList.add('reveal-in')); }
    });
    // Keyboard focus must never land on visually hidden content.
    document.addEventListener('focusin', event => event.target.closest('.scroll-reveal')?.classList.add('reveal-in'));
  }

  const counters = document.querySelectorAll('[data-count]');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const text = entry.target.querySelector('span');
      const final = Number(entry.target.dataset.count);
      const format = new Intl.NumberFormat(root.lang === 'tr' ? 'tr-TR' : 'en-US');
      const started = performance.now();
      const step = now => {
        const progress = Math.min((now - started) / 1600, 1);
        const done = progress === 1 || reduced.matches || document.hidden;
        text.textContent = format.format(done ? final : Math.round(final * (1 - (1-progress) ** 3)));
        if (!done) requestAnimationFrame(step);
      };
      text.textContent = '0';
      requestAnimationFrame(step);
    }), {threshold: .6});
    counters.forEach(counter => countObserver.observe(counter));
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if(navToggle) navToggle.addEventListener('click', () => navMenu.classList.toggle('hidden'));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target) target.scrollIntoView({ behavior: 'smooth' });
      if(navMenu && !navMenu.classList.contains('hidden')) navMenu.classList.add('hidden');
    });
  });

  // Fade-up animation using IntersectionObserver
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('show');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

  // Typing effect for hero heading
  const heroText = document.getElementById('hero-text');
  const fullText = "Discover The Beauty";
  let i = 0;
  function type() {
    if(i <= fullText.length){
      heroText.textContent = fullText.slice(0,i);
      i++;
      setTimeout(type, 100);
    }
  }
  type();
});

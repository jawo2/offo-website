// Tab filter switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const section = tab.dataset.section;
    const filter = tab.dataset.filter;
    document.querySelectorAll(`[data-section="${section}"].tab`).forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const grid = document.querySelector(`.${section} .cards-grid`);
    if (grid) {
      grid.querySelectorAll('.card[data-filter]').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.filter === filter) ? '' : 'none';
      });
    }
  });
});

// Collaboration slider
const slider = document.getElementById('collabSlider');
const dots = document.querySelectorAll('.dot');
let current = 0;

function goToSlide(index) {
  current = index;
  slider.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(Number(dot.dataset.index)));
});

// Auto-advance slider every 4 seconds
setInterval(() => goToSlide((current + 1) % dots.length), 4000);

// Active nav link on scroll
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => observer.observe(s));

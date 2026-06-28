// Proyectos carousel with filter
(function () {
  const track = document.querySelector('.proyectos .cards-track');
  if (!track) return;

  const sourceCards = Array.from(track.querySelectorAll('.card[data-filter]'));
  const carousel = track.closest('.cards-carousel');
  const BASE_SPEED = 70; // px/s

  let playingVideo = null;

  function pauseCarousel() { carousel.classList.add('video-active'); }
  function resumeCarousel() { carousel.classList.remove('video-active'); }

  function attachVideoEvents() {
    track.querySelectorAll('video').forEach(video => {
      // Show first frame — check readyState in case metadata already loaded before this listener ran
      const showFirstFrame = () => { video.currentTime = 0.001; };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        showFirstFrame();
      } else {
        video.addEventListener('loadedmetadata', showFirstFrame, { once: true });
      }

      video.addEventListener('click', () => {
        if (video.paused) {
          if (playingVideo && playingVideo !== video) {
            const prev = playingVideo;
            playingVideo = null; // null before pause so its pause event doesn't trigger resumeCarousel
            prev.pause();
            prev.muted = true;
            prev.currentTime = 0;
          }
          playingVideo = video;
          video.muted = false; // unmute when user explicitly plays
          video.play();
        } else {
          video.pause();
        }
      });

      video.addEventListener('pause', () => {
        if (playingVideo === video) {
          playingVideo = null;
          video.muted = true;
        }
      });
    });

    track.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', pauseCarousel);
      card.addEventListener('mouseleave', resumeCarousel);
    });
  }

  function buildCarousel(filter) {
    playingVideo = null;
    carousel.classList.remove('video-active');

    const matching = filter === 'all'
      ? sourceCards
      : sourceCards.filter(c => c.dataset.filter === filter);

    track.style.gap = matching.length <= 4 ? '64px' : matching.length <= 8 ? '40px' : '16px';
    track.innerHTML = '';
    [...matching, ...matching.map(c => c.cloneNode(true))].forEach(c => track.appendChild(c));

    track.style.animationPlayState = '';
    track.style.animationName = 'none';
    track.offsetHeight;
    const duration = (track.scrollWidth / 2) / BASE_SPEED;
    track.style.animationName = 'carousel-scroll';
    track.style.animationDuration = `${duration}s`;
    track.style.animationTimingFunction = 'linear';
    track.style.animationIterationCount = 'infinite';

    attachVideoEvents();
  }

  buildCarousel('all');

  document.querySelectorAll('.proyectos .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.proyectos .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      buildCarousel(tab.dataset.filter);
    });
  });
})();

// Contenido tab filter switching
document.querySelectorAll('.contenido .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    document.querySelectorAll('.contenido .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const grid = document.querySelector('.contenido .cards-grid');
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

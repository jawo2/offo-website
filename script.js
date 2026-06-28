// Proyectos carousel with filter
(function () {
  const track = document.querySelector('.proyectos .cards-track');
  if (!track) return;

  const sourceCards = Array.from(track.querySelectorAll('.card[data-filter]'));
  const carousel = track.closest('.cards-carousel');
  const BASE_SPEED = 70; // px/s

  let playingVideo = null;

  const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
  const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;

  function getIcon(video) {
    return video.closest('.card').querySelector('.mute-icon');
  }

  function pauseCarousel() { carousel.classList.add('video-active'); }
  function resumeCarousel() { carousel.classList.remove('video-active'); }

  function attachVideoEvents() {
    track.querySelectorAll('video').forEach(video => {
      // Show first frame — check readyState in case metadata already loaded before this listener ran
      video.play().catch(() => {});

      const showFirstFrame = () => { video.currentTime = 0.001; };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        showFirstFrame();
      } else {
        video.addEventListener('loadedmetadata', showFirstFrame, { once: true });
      }

      const icon = document.createElement('span');
      icon.className = 'mute-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = ICON_MUTED;
      video.closest('.card').appendChild(icon);

      video.addEventListener('click', () => {
        if (video.muted) {
          if (playingVideo && playingVideo !== video) {
            playingVideo.muted = true;
            getIcon(playingVideo).innerHTML = ICON_MUTED;
          }
          video.muted = false;
          icon.innerHTML = ICON_UNMUTED;
          playingVideo = video;
        } else {
          video.muted = true;
          icon.innerHTML = ICON_MUTED;
          playingVideo = null;
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

// Contenido carousel with filter
(function () {
  const track = document.querySelector('.contenido .cards-track');
  if (!track) return;

  const sourceCards = Array.from(track.querySelectorAll('.card[data-filter]'));
  const carousel = track.closest('.cards-carousel');
  const BASE_SPEED = 70;

  let playingVideo = null;

  const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
  const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;

  function getIcon(video) {
    return video.closest('.card').querySelector('.mute-icon');
  }

  function pauseCarousel() { carousel.classList.add('video-active'); }
  function resumeCarousel() { carousel.classList.remove('video-active'); }

  function attachVideoEvents() {
    track.querySelectorAll('video').forEach(video => {
      video.play().catch(() => {});

      const showFirstFrame = () => { video.currentTime = 0.001; };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        showFirstFrame();
      } else {
        video.addEventListener('loadedmetadata', showFirstFrame, { once: true });
      }

      const icon = document.createElement('span');
      icon.className = 'mute-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = ICON_MUTED;
      video.closest('.card').appendChild(icon);

      video.addEventListener('click', () => {
        if (video.muted) {
          if (playingVideo && playingVideo !== video) {
            playingVideo.muted = true;
            getIcon(playingVideo).innerHTML = ICON_MUTED;
          }
          video.muted = false;
          icon.innerHTML = ICON_UNMUTED;
          playingVideo = video;
        } else {
          video.muted = true;
          icon.innerHTML = ICON_MUTED;
          playingVideo = null;
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

  document.querySelectorAll('.contenido .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.contenido .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      buildCarousel(tab.dataset.filter);
    });
  });
})();

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

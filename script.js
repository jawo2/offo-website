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

  function pauseCarousel() { track.style.animationPlayState = 'paused'; }
  function resumeCarousel() { track.style.animationPlayState = 'running'; }

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

  function buildMobileCarousel(filter) {
    track.innerHTML = '';
    track.style.animationName = 'none';
    track.style.animationDuration = '';
    track.style.transform = '';
    track.style.gap = '12px';

    const matching = filter === 'all'
      ? sourceCards
      : sourceCards.filter(c => c.dataset.filter === filter);

    if (!matching.length) return;

    matching.forEach(c => {
      track.appendChild(c.cloneNode(true));
    });

    attachVideoEvents();
  }

  function buildCarousel(filter) {
    playingVideo = null;
    track.style.animationPlayState = '';

    if (window.innerWidth <= 768) {
      buildMobileCarousel(filter);
      return;
    }

    const matching = filter === 'all'
      ? sourceCards
      : sourceCards.filter(c => c.dataset.filter === filter);

    if (!matching.length) { track.innerHTML = ''; return; }

    const gapPx = 16;
    track.style.gap = '0';

    // Measure one set with marginRight to find how many repeats fill the viewport
    track.innerHTML = '';
    matching.forEach(c => {
      const clone = c.cloneNode(true);
      clone.style.marginRight = `${gapPx}px`;
      track.appendChild(clone);
    });
    track.style.animationName = 'none';
    const repeats = Math.max(1, Math.ceil(carousel.offsetWidth / track.scrollWidth));

    // Build 2 × repeats sets for seamless -50% loop, always fresh clones
    track.innerHTML = '';
    for (let i = 0; i < repeats * 2; i++) {
      matching.forEach(c => {
        const clone = c.cloneNode(true);
        clone.style.marginRight = `${gapPx}px`;
        track.appendChild(clone);
      });
    }

    track.style.animationName = 'none';
    const duration = (track.scrollWidth / 2) / BASE_SPEED;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.animationName = 'carousel-scroll';
        track.style.animationDuration = `${duration}s`;
        track.style.animationTimingFunction = 'linear';
        track.style.animationIterationCount = 'infinite';
      });
    });

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

  function pauseCarousel() { track.style.animationPlayState = 'paused'; }
  function resumeCarousel() { track.style.animationPlayState = 'running'; }

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

  function buildMobileCarousel(filter) {
    track.innerHTML = '';
    track.style.animationName = 'none';
    track.style.animationDuration = '';
    track.style.transform = '';
    track.style.gap = '12px';

    const matching = filter === 'all'
      ? sourceCards
      : sourceCards.filter(c => c.dataset.filter === filter);

    if (!matching.length) return;

    matching.forEach(c => {
      track.appendChild(c.cloneNode(true));
    });

    attachVideoEvents();
  }

  function buildCarousel(filter) {
    playingVideo = null;
    track.style.animationPlayState = '';

    if (window.innerWidth <= 768) {
      buildMobileCarousel(filter);
      return;
    }

    const matching = filter === 'all'
      ? sourceCards
      : sourceCards.filter(c => c.dataset.filter === filter);

    if (!matching.length) { track.innerHTML = ''; return; }

    const gapPx = 16;
    track.style.gap = '0';

    // Measure one set with marginRight to find how many repeats fill the viewport
    track.innerHTML = '';
    matching.forEach(c => {
      const clone = c.cloneNode(true);
      clone.style.marginRight = `${gapPx}px`;
      track.appendChild(clone);
    });
    track.style.animationName = 'none';
    const repeats = Math.max(1, Math.ceil(carousel.offsetWidth / track.scrollWidth));

    // Build 2 × repeats sets for seamless -50% loop, always fresh clones
    track.innerHTML = '';
    for (let i = 0; i < repeats * 2; i++) {
      matching.forEach(c => {
        const clone = c.cloneNode(true);
        clone.style.marginRight = `${gapPx}px`;
        track.appendChild(clone);
      });
    }

    track.style.animationName = 'none';
    const duration = (track.scrollWidth / 2) / BASE_SPEED;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.animationName = 'carousel-scroll';
        track.style.animationDuration = `${duration}s`;
        track.style.animationTimingFunction = 'linear';
        track.style.animationIterationCount = 'infinite';
      });
    });

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

// Collaboration cards
const collabCards = document.querySelectorAll('.collab-card');
const collabDeck = document.getElementById('collabDeck');

// Mobile: activate the card currently centered in the scroll deck
function activateCenterCollabCard() {
  if (!collabDeck || window.innerWidth > 768) return;
  const deckCenter = collabDeck.scrollLeft + collabDeck.offsetWidth / 2;
  let closest = null;
  let closestDist = Infinity;
  collabCards.forEach(card => {
    const center = card.offsetLeft + card.offsetWidth / 2;
    const dist = Math.abs(center - deckCenter);
    if (dist < closestDist) { closestDist = dist; closest = card; }
  });
  if (closest) {
    collabCards.forEach(c => c.classList.remove('is-open'));
    closest.classList.add('is-open');
  }
}

// Desktop: click to expand, click outside to close
collabCards.forEach(card => {
  card.addEventListener('click', () => {
    if (window.innerWidth <= 768) return;
    const wasOpen = card.classList.contains('is-open');
    collabCards.forEach(c => c.classList.remove('is-open'));
    if (!wasOpen) card.classList.add('is-open');
  });
});

document.addEventListener('click', e => {
  if (window.innerWidth <= 768) return;
  if (!e.target.closest('.collab-card')) {
    collabCards.forEach(c => c.classList.remove('is-open'));
  }
});

if (collabDeck) {
  collabDeck.addEventListener('scroll', activateCenterCollabCard, { passive: true });
}

if (collabCards.length) {
  if (window.innerWidth <= 768) {
    setTimeout(activateCenterCollabCard, 150);
  } else {
    collabCards[0].classList.add('is-open');
  }
}

// Active nav link on scroll
const NAV_HEIGHT = 58;
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav-hamburger');

// Nav jump — instant scroll to section, sets both containers for cross-browser support
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    // Close mobile hamburger menu
    nav.classList.remove('nav-open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    const idx = Array.from(sections).findIndex(s => s.id === href.slice(1));
    if (idx < 0) return;
    const targetY = idx * (window.innerHeight - NAV_HEIGHT);
    document.documentElement.scrollTop = targetY;
    document.body.scrollTop = targetY;
    if (href === '#colaboracion' && collabCards.length) {
      setTimeout(() => {
        if (window.innerWidth <= 768) {
          if (collabDeck) collabDeck.scrollLeft = 0;
          activateCenterCollabCard();
        } else {
          collabCards.forEach(c => c.classList.remove('is-open'));
          collabCards[0].classList.add('is-open');
        }
      }, 0);
    }
  });
});

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

// Mobile hamburger
if (hamburger) {
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', nav.classList.contains('nav-open') ? 'true' : 'false');
  });
  document.addEventListener('click', e => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
      nav.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Nav color theme — inverts when scrolling over amber sections
const invertedSections = new Set(['proyectos', 'contenido']);

function updateNavTheme() {
  let current = sections[0];
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= NAV_HEIGHT) current = section;
  });
  nav.classList.toggle('nav-inverted', invertedSections.has(current.id));
}

window.addEventListener('scroll', updateNavTheme, { passive: true });
updateNavTheme();

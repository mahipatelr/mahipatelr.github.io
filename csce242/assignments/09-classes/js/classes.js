// js/classes.js
// Thumbnail-first modal: show YouTube thumbnail if available, inject iframe only on play click.
// Works with W3 modal markup used in your HTML.

(function () {
  'use strict';

  function log(...args) {
    console.debug('[classes.js]', ...args);
  }

  // Extract YouTube video ID from common URL forms
  function extractYouTubeId(url) {
    try {
      if (!url) return null;
      const u = new URL(url);
      // embed path: /embed/ID
      if (u.pathname.includes('/embed/')) {
        const parts = u.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || null;
      }
      // watch?v=ID
      const v = u.searchParams.get('v');
      if (v) return v;
      // youtu.be/ID
      const seg = u.pathname.split('/').filter(Boolean).pop();
      return seg || null;
    } catch (e) {
      return null;
    }
  }

  class Song {
    constructor({ title, artist, album, year, genre, coverFile, youtubeLink }) {
      this.title = title;
      this.artist = artist;
      this.album = album;
      this.year = year;
      this.genre = genre;
      this.coverFile = coverFile;
      this.youtubeLink = youtubeLink;
    }

    getCard() {
      const section = document.createElement('section');
      section.className = 'song-card';
      section.tabIndex = 0;
      section.setAttribute('role', 'button');
      section.setAttribute('aria-label', `${this.title} by ${this.artist}`);

      const header = document.createElement('div');
      header.className = 'song-card-header';

      const titleEl = document.createElement('h3');
      titleEl.className = 'song-card-title';
      titleEl.textContent = this.title;

      const artistEl = document.createElement('p');
      artistEl.className = 'song-card-artist';
      artistEl.textContent = `By ${this.artist}`;

      header.appendChild(titleEl);
      header.appendChild(artistEl);

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'song-card-image-wrap';

      const img = document.createElement('img');
      img.src = this.coverFile;
      img.alt = `${this.title} cover art`;
      img.className = 'song-card-image';

      // fallback for missing local cover image
      img.onerror = function () {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-size='20'>No image</text></svg>`;
        this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        this.onerror = null;
      };

      imgWrapper.appendChild(img);
      section.appendChild(header);
      section.appendChild(imgWrapper);

      // Accessible activation
      const openHandler = (e) => {
        if (e) e.preventDefault?.();
        openSongModal(this);
      };

      section.addEventListener('click', openHandler);
      section.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          openHandler();
        }
      });

      return section;
    }
  }

  // Build the modal content (thumbnail first)
  function openSongModal(song) {
    log('openSongModal', song.title);
    const modal = document.getElementById('songModal');
    const media = document.getElementById('modal-media');

    // fill right-side text
    const titleEl = document.getElementById('modal-title');
    const artistEl = document.getElementById('modal-artist');
    const albumEl = document.getElementById('modal-album');
    const genreEl = document.getElementById('modal-genre');

    if (titleEl) titleEl.textContent = song.title || '';
    if (artistEl) artistEl.textContent = `by ${song.artist || ''}`;
    if (albumEl) albumEl.textContent = `${song.album || ''}, ${song.year || ''}`;
    if (genreEl) genreEl.textContent = song.genre || '';

    // clear previous media
    media.innerHTML = '';

    const id = extractYouTubeId(song.youtubeLink);
    if (!id) {
      // no ID — show friendly message
      const msg = document.createElement('div');
      msg.className = 'thumb-no';
      msg.textContent = 'No preview available.';
      media.appendChild(msg);
      showModal(modal);
      return;
    }

    // Build thumbnail url
    const thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    // Create wrapper (maintains aspect ratio)
    const wrapper = document.createElement('div');
    wrapper.className = 'thumb-wrapper';
    // style fallback if your CSS doesn't cover it
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.paddingBottom = '56.25%';
    wrapper.style.background = '#000';
    wrapper.style.borderRadius = '6px';
    wrapper.style.overflow = 'hidden';

    // Create img element to test loading
    const thumbnail = document.createElement('img');
    thumbnail.src = thumbUrl;
    thumbnail.alt = `${song.title} thumbnail`;
    thumbnail.style.position = 'absolute';
    thumbnail.style.top = '0';
    thumbnail.style.left = '0';
    thumbnail.style.width = '100%';
    thumbnail.style.height = '100%';
    thumbnail.style.objectFit = 'cover';

    // Play overlay
    const playBtn = document.createElement('button');
    playBtn.className = 'play-overlay';
    playBtn.setAttribute('aria-label', 'Play video');
    playBtn.innerHTML = '▶';
    playBtn.style.position = 'absolute';
    playBtn.style.left = '50%';
    playBtn.style.top = '50%';
    playBtn.style.transform = 'translate(-50%, -50%)';
    playBtn.style.width = '72px';
    playBtn.style.height = '72px';
    playBtn.style.borderRadius = '50%';
    playBtn.style.border = 'none';
    playBtn.style.fontSize = '28px';
    playBtn.style.background = 'rgba(0,0,0,0.6)';
    playBtn.style.color = 'white';
    playBtn.style.cursor = 'pointer';

    // If thumbnail loads, append wrapper and show play button
    let thumbLoaded = false;
    thumbnail.addEventListener('load', () => {
      thumbLoaded = true;
      wrapper.appendChild(thumbnail);
      wrapper.appendChild(playBtn);
      media.appendChild(wrapper);
    });

    // If thumbnail fails, show fallback message + direct link
    thumbnail.addEventListener('error', () => {
      log('thumbnail load failed for', id, 'showing fallback message');
      const msg = document.createElement('div');
      msg.className = 'thumb-no';
      msg.textContent = 'Preview unavailable. Open on YouTube.';
      // small link below msg
      const link = document.createElement('a');
      link.href = `https://www.youtube.com/watch?v=${id}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open on YouTube';
      link.style.display = 'inline-block';
      link.style.marginTop = '0.6rem';
      msg.appendChild(document.createElement('br'));
      msg.appendChild(link);
      media.appendChild(msg);
    });

    // clicking the thumbnail or play -> insert iframe with autoplay
    const insertIframe = () => {
      log('inserting iframe for', id);
      media.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'embed-wrap';
      const iframe = document.createElement('iframe');
      // use nocookie and autoplay
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
      iframe.title = `${song.title} — player`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '360px';
      iframe.style.border = '0';
      wrap.appendChild(iframe);

      // small heuristic: keep a visible "Open on YouTube" link below the player in case embed fails
      const fallback = document.createElement('div');
      fallback.style.marginTop = '0.6rem';
      const openLink = document.createElement('a');
      openLink.href = `https://www.youtube.com/watch?v=${id}`;
      openLink.target = '_blank';
      openLink.rel = 'noopener';
      openLink.textContent = 'Open on YouTube';
      fallback.appendChild(openLink);

      media.appendChild(wrap);
      media.appendChild(fallback);
    };

    // wire interactions
    playBtn.addEventListener('click', insertIframe);
    thumbnail.addEventListener('click', insertIframe);
    // keyboard accessible
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        insertIframe();
      }
    });

    // show modal once we appended something (either thumbnail will load and append asynchronously,
    // or error will append fallback). We still open modal now so user sees loading state.
    showModal(modal);
  }

  function showModal(modal) {
    if (!modal) return;
    // using block to match W3 usage
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    // prevent background scroll
    document.body.classList.add('w3-modal-open');
  }

  function closeModal() {
    const modal = document.getElementById('songModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const media = document.getElementById('modal-media');
    if (media) media.innerHTML = '';
    document.body.classList.remove('w3-modal-open');
  }

  // close handlers
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
    log('DOMContentLoaded — building songs');

    const songs = [
      new Song({
        title: 'Two-Headed Boy',
        artist: 'Neutral Milk Hotel',
        album: 'In the Aeroplane Over the Sea',
        year: 1998,
        genre: 'Folk Music',
        coverFile: '../../images/two-headed.png',
        youtubeLink: 'https://www.youtube.com/watch?v=rY0WxgSXdEE'
      }),
      new Song({
        title: 'Jailhouse Rock',
        artist: 'Elvis Presley',
        album: 'Jailhouse Rock (EP)',
        year: 1957,
        genre: 'Rock & Roll Music',
        coverFile: '../../images/jailhouse.png',
        youtubeLink: 'https://www.youtube.com/watch?v=ru1t8yQIn9c'
      }),
      new Song({
        title: 'So What',
        artist: 'Miles Davis',
        album: 'Kind of Blue',
        year: 1959,
        genre: 'Jazz Music',
        coverFile: '../../images/sowhat.png',
        youtubeLink: 'https://www.youtube.com/watch?v=zqNTltOGh5c'
      }),
      new Song({
        title: 'Jolene',
        artist: 'Dolly Parton',
        album: 'Jolene',
        year: 1974,
        genre: 'Country Music',
        coverFile: '../../images/jolene.png',
        youtubeLink: 'https://www.youtube.com/watch?v=sXZ1SClv2RQ'
      })
    ];

    const container = document.getElementById('dogs');
    if (!container) {
      console.error('[classes.js] container #dogs not found');
      return;
    }
    container.innerHTML = '';
    songs.forEach((s) => container.appendChild(s.getCard()));

    // close button
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // clicking the overlay closes
    const modal = document.getElementById('songModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    log('songs rendered — try clicking a card now');
  });
})();
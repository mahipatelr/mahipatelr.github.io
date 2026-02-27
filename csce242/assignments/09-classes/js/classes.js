(function () {
  'use strict';

  function extractYouTubeId(url) {
    try {
      if (!url) return null;
      const u = new URL(url);
      if (u.pathname.includes('/embed/')) {
        const parts = u.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || null;
      }
      const v = u.searchParams.get('v');
      if (v) return v;
      const seg = u.pathname.split('/').filter(Boolean).pop();
      return seg || null;
    } catch {
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

      img.onerror = function () {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-size='20'>No image</text></svg>`;
        this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        this.onerror = null;
      };

      imgWrapper.appendChild(img);
      section.appendChild(header);
      section.appendChild(imgWrapper);

      const openHandler = () => openSongModal(this);

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

  function showModal(modal) {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('w3-modal-open');
  }

  function closeModal() {
    const modal = document.getElementById('songModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const media = document.getElementById('modal-media');
    media.innerHTML = '';
    document.body.classList.remove('w3-modal-open');
  }

  function openSongModal(song) {
    const modal = document.getElementById('songModal');
    const media = document.getElementById('modal-media');

    document.getElementById('modal-title').textContent = song.title;
    document.getElementById('modal-artist').textContent = `by ${song.artist}`;
    document.getElementById('modal-album').textContent = `${song.album}, ${song.year}`;
    document.getElementById('modal-genre').textContent = song.genre;

    media.innerHTML = '';

    const id = extractYouTubeId(song.youtubeLink);
    if (!id) {
      const msg = document.createElement('div');
      msg.className = 'thumb-no';
      msg.textContent = 'No preview available.';
      media.appendChild(msg);
      showModal(modal);
      return;
    }

    const thumbUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    const wrapper = document.createElement('div');
    wrapper.className = 'thumb-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.paddingBottom = '56.25%';
    wrapper.style.background = '#000';
    wrapper.style.borderRadius = '6px';
    wrapper.style.overflow = 'hidden';

    const thumbnail = document.createElement('img');
    thumbnail.src = thumbUrl;
    thumbnail.alt = `${song.title} thumbnail`;
    thumbnail.style.position = 'absolute';
    thumbnail.style.top = '0';
    thumbnail.style.left = '0';
    thumbnail.style.width = '100%';
    thumbnail.style.height = '100%';
    thumbnail.style.objectFit = 'cover';

    const playBtn = document.createElement('button');
    playBtn.className = 'play-overlay';
    playBtn.setAttribute('aria-label', 'Play video');
    playBtn.innerHTML = '▶';

    thumbnail.addEventListener('load', () => {
      wrapper.appendChild(thumbnail);
      wrapper.appendChild(playBtn);
      media.appendChild(wrapper);
    });

    thumbnail.addEventListener('error', () => {
      const msg = document.createElement('div');
      msg.className = 'thumb-no';
      msg.textContent = 'Preview unavailable. Open on YouTube.';
      const link = document.createElement('a');
      link.href = `https://www.youtube.com/watch?v=${id}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open on YouTube';
      link.style.display = 'inline-block';
      link.style.marginTop = '.6rem';
      msg.appendChild(document.createElement('br'));
      msg.appendChild(link);
      media.appendChild(msg);
    });

    const insertIframe = () => {
      media.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'embed-wrap';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
      iframe.title = `${song.title} — player`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '360px';
      iframe.style.border = '0';
      wrap.appendChild(iframe);
      media.appendChild(wrap);
    };

    playBtn.addEventListener('click', insertIframe);
    thumbnail.addEventListener('click', insertIframe);
    playBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        insertIframe();
      }
    });

    showModal(modal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('DOMContentLoaded', () => {
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
        title: 'Never Gonna Give You Up',
        artist: 'Rick Astley',
        album: 'Whenever You Need Somebody',
        year: 1987,
        genre: 'Pop Music',
        coverFile: '../../images/jailhouse.png',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        year: 2017,
        genre: 'Pop Music',
        coverFile: '../../images/jolene.png',
        youtubeLink: 'https://www.youtube.com/watch?v=JGwWNGJdvx8'
      })
    ];

    const container = document.getElementById('dogs');
    container.innerHTML = '';
    songs.forEach((s) => container.appendChild(s.getCard()));

    document.getElementById('modal-close').addEventListener('click', closeModal);

    document.getElementById('songModal').addEventListener('click', (e) => {
      if (e.target.id === 'songModal') closeModal();
    });
  });
})();
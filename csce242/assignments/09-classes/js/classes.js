(function () {

  function extractYouTubeId(url) {
    try {
      if (!url) return null;
      var u = new URL(url);
      if (u.pathname.indexOf('/embed/') > -1) {
        var parts = u.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || null;
      }
      var v = u.searchParams.get('v');
      if (v) return v;
      var seg = u.pathname.split('/').filter(Boolean).pop();
      return seg || null;
    } catch (e) {
      return null;
    }
  }

  function createEl(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') el.textContent = attrs[k];
        else if (k === 'html') el.innerHTML = attrs[k];
        else el.setAttribute(k, attrs[k]);
      });
    }
    if (children) children.forEach(function (c) { el.appendChild(c); });
    return el;
  }

  function Song(data) {
    this.title = data.title;
    this.artist = data.artist;
    this.album = data.album;
    this.year = data.year;
    this.genre = data.genre;
    this.coverFile = data.coverFile;
    this.youtubeLink = data.youtubeLink;
  }

  Song.prototype.getCard = function () {
    var section = createEl('section', {
      class: 'song-card',
      tabindex: 0,
      role: 'button',
      'aria-label': this.title + ' by ' + this.artist
    });

    var header = createEl('div', { class: 'song-card-header' });
    var titleEl = createEl('h3', { class: 'song-card-title', text: this.title });
    var artistEl = createEl('p', { class: 'song-card-artist', text: 'By ' + this.artist });
    header.appendChild(titleEl);
    header.appendChild(artistEl);

    var imgWrap = createEl('div', { class: 'song-card-image-wrap' });
    var img = createEl('img', { class: 'song-card-image', src: this.coverFile, alt: this.title + ' cover art' });

    img.onerror = function () {
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>" +
                "<rect width='100%' height='100%' fill='#ddd'/>" +
                "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-size='20'>No image</text>" +
                "</svg>";
      this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      this.onerror = null;
    };

    imgWrap.appendChild(img);
    section.appendChild(header);
    section.appendChild(imgWrap);

    var self = this;

    function openHandler(e) {
      if (e && e.preventDefault) e.preventDefault();
      openSongModal(self);
    }

    section.addEventListener('click', openHandler);
    section.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openHandler();
      }
    });

    return section;
  };

  function showModal(modal) {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('w3-modal-open');
  }

  function closeModal() {
    var modal = document.getElementById('songModal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    var media = document.getElementById('modal-media');
    if (media) media.innerHTML = '';
    document.body.classList.remove('w3-modal-open');
  }

  function openSongModal(song) {
    var modal = document.getElementById('songModal');
    var media = document.getElementById('modal-media');

    var titleEl = document.getElementById('modal-title');
    var artistEl = document.getElementById('modal-artist');
    var albumEl = document.getElementById('modal-album');
    var genreEl = document.getElementById('modal-genre');

    if (titleEl) titleEl.textContent = song.title || '';
    if (artistEl) artistEl.textContent = 'by ' + (song.artist || '');
    if (albumEl) albumEl.textContent = (song.album || '') + ', ' + (song.year || '');
    if (genreEl) genreEl.textContent = song.genre || '';

    if (!media) return;
    media.innerHTML = '';

    var id = extractYouTubeId(song.youtubeLink);

    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.paddingBottom = '56.25%';
    wrapper.style.background = '#000';
    wrapper.style.borderRadius = '6px';
    wrapper.style.overflow = 'hidden';

    var img = document.createElement('img');
    img.src = song.coverFile;
    img.alt = song.title + ' cover';
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    img.onerror = function () {
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>" +
                "<rect width='100%' height='100%' fill='#000'/>" +
                "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#fff' font-size='18'>Preview unavailable</text>" +
                "</svg>";
      this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      this.onerror = null;
    };

    var play = document.createElement('button');
    play.className = 'play-overlay';
    play.setAttribute('aria-label', 'Play video');
    play.innerHTML = '▶';
    play.disabled = false;

    function insertIframeOnce() {
      if (!id) {
        media.innerHTML = '';
        var msg = createEl('div', { class: 'thumb-no', text: 'No embed available.' });
        var link = createEl('a', { href: song.youtubeLink || '#', text: 'Open on YouTube' });
        link.target = '_blank';
        link.rel = 'noopener';
        msg.appendChild(document.createElement('br'));
        msg.appendChild(link);
        media.appendChild(msg);
        return;
      }

      if (media.getAttribute('data-playing') === 'true') return;

      media.setAttribute('data-playing', 'true');
      media.innerHTML = '';

      var wrap = document.createElement('div');
      wrap.className = 'embed-wrap';

      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1';
      iframe.title = song.title + ' — player';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '360px';
      iframe.style.border = '0';

      wrap.appendChild(iframe);

      var fallback = document.createElement('div');
      fallback.style.marginTop = '.6rem';
      var openLink = document.createElement('a');
      openLink.href = 'https://www.youtube.com/watch?v=' + id;
      openLink.target = '_blank';
      openLink.rel = 'noopener';
      openLink.textContent = 'Open on YouTube';
      fallback.appendChild(openLink);

      media.appendChild(wrap);
      media.appendChild(fallback);
      play.disabled = true;
    }

    play.addEventListener('click', insertIframeOnce);
    play.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        insertIframeOnce();
      }
    });

    wrapper.appendChild(img);
    wrapper.appendChild(play);
    media.appendChild(wrapper);

    media.removeAttribute('data-playing');

    showModal(modal);
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('DOMContentLoaded', function () {
    var songs = [
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

    var container = document.getElementById('dogs');
    if (!container) return;
    container.innerHTML = '';
    songs.forEach(function (s) { container.appendChild(s.getCard()); });

    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var modal = document.getElementById('songModal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }
  });

})();
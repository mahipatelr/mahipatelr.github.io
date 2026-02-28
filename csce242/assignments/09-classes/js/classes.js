function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.pathname.includes('/embed/')) {
      const parts = u.pathname.split('/');
      return parts[parts.length - 1];
    }
    const v = u.searchParams.get('v');
    if (v) return v;
    const seg = u.pathname.split('/').filter(Boolean).pop();
    return seg || null;
  } catch {
    return null;
  }
}

function loadThumbnailToBackground(thumbBoxElement, videoId) {
  if (!videoId) {
    thumbBoxElement.style.background = '#000';
    return;
  }

  const variants = [
    'maxresdefault',
    'sddefault',
    'hqdefault',
    'mqdefault',
    'default'
  ];

  let i = 0;

  function tryNext() {
    if (i >= variants.length) {
      thumbBoxElement.style.background = '#000';
      return;
    }

    const name = variants[i++];
    const url = `https://img.youtube.com/vi/${videoId}/${name}.jpg`;
    const loader = new Image();

    loader.onload = function () {
      thumbBoxElement.style.backgroundImage = `url("${url}")`;
      thumbBoxElement.style.backgroundSize = 'cover';
      thumbBoxElement.style.backgroundPosition = 'center';
    };

    loader.onerror = function () {
      tryNext();
    };

    loader.src = url;
  }

  tryNext();
}

class Song {
  constructor({ title, artist, album, year, genre, coverFile, embedUrl }) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.year = year;
    this.genre = genre;
    this.coverFile = coverFile;
    this.embedUrl = embedUrl;
  }

  getCard() {
    const section = document.createElement('section');
    section.className = 'song-card';
    section.tabIndex = 0;

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
    img.className = 'song-card-image';

    img.onerror = function () {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
        <rect width='100%' height='100%' fill='#ddd'/>
        <text x='50%' y='50%' dominant-baseline='middle'
        text-anchor='middle' fill='#666' font-size='20'>No image</text>
      </svg>`;
      this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      this.onerror = null;
    };

    imgWrapper.appendChild(img);

    section.appendChild(header);
    section.appendChild(imgWrapper);

    section.addEventListener('click', () => openSongModal(this));
    section.addEventListener('keydown', (e) => {
      if (e.key === "Enter") openSongModal(this);
    });

    return section;
  }
}

function openSongModal(song) {
  document.getElementById('modal-title').textContent = song.title;
  document.getElementById('modal-artist').textContent = song.artist;
  document.getElementById('modal-album').textContent = song.album;
  document.getElementById('modal-year').textContent = song.year;
  document.getElementById('modal-genre').textContent = song.genre;

  const media = document.getElementById('modal-media');
  media.innerHTML = '';

  const videoId = extractYouTubeId(song.embedUrl);
  const youtubeWatch = `https://www.youtube.com/watch?v=${videoId}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'thumb-wrapper';

  const thumb = document.createElement('div');
  thumb.className = 'thumb-box';

  loadThumbnailToBackground(thumb, videoId);

  const overlay = document.createElement('div');
  overlay.className = 'play-overlay';
  overlay.textContent = '▶';

  thumb.appendChild(overlay);
  wrapper.appendChild(thumb);

  thumb.addEventListener('click', () => {
    window.open(youtubeWatch, '_blank', 'noopener');
  });

  media.appendChild(wrapper);

  const modal = document.getElementById('songModal');
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('songModal').style.display = 'none';
  document.getElementById('modal-media').innerHTML = '';
}

window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
  const songs = [
    new Song({
      title: "Two-Headed Boy",
      artist: "Neutral Milk Hotel",
      album: "In the Aeroplane Over the Sea",
      year: 1998,
      genre: "Folk / Indie",
      coverFile: "../../images/two-headed.png",
      embedUrl: "https://www.youtube.com/embed/rY0WxgSXdEE"
    }),
    new Song({
      title: "Jailhouse Rock",
      artist: "Elvis Presley",
      album: "Jailhouse Rock (EP)",
      year: 1957,
      genre: "Rock & Roll",
      coverFile: "../../images/jailhouse.png",
      embedUrl: "https://youtu.be/gj0Rz-uP4Mk?si=t2j0i8xViMgZVY3T"
    }),
    new Song({
      title: "So What",
      artist: "Miles Davis",
      album: "Kind of Blue",
      year: 1959,
      genre: "Jazz",
      coverFile: "../../images/sowhat.png",
      embedUrl: "https://www.youtube.com/embed/zqNTltOGh5c"
    }),
    new Song({
      title: "Jolene",
      artist: "Dolly Parton",
      album: "Jolene",
      year: 1974,
      genre: "Country",
      coverFile: "../../images/jolene.png",
      embedUrl: "https://youtu.be/Ixrje2rXLMA?si=9wqCDtWZXKg0_oW2"
    })
  ];

  const container = document.getElementById('dogs');
  songs.forEach(song => container.appendChild(song.getCard()));
});
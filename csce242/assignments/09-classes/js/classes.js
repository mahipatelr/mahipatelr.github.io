// js/classes.js
// Final clean version

(function () {

  function extractYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.pathname.includes('/embed/')) {
        const parts = u.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1];
      }
      return u.searchParams.get('v') || null;
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

      const img = document.createElement('img');
      img.src = this.coverFile;
      img.className = 'song-card-image';

      section.appendChild(header);
      section.appendChild(img);

      section.addEventListener('click', () => openSongModal(this));

      return section;
    }
  }

  function openSongModal(song) {

    document.getElementById('modal-title').textContent = song.title;
    document.getElementById('modal-artist').textContent = `by ${song.artist}`;
    document.getElementById('modal-album').textContent =
      `${song.album}, ${song.year}`;
    document.getElementById('modal-genre').textContent = song.genre;

    const media = document.getElementById('modal-media');
    media.innerHTML = '';

    const videoId = extractYouTubeId(song.youtubeLink);

    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      media.appendChild(iframe);
    }

    document.getElementById('songModal').style.display = 'block';
  }

  function closeModal() {
    document.getElementById('songModal').style.display = 'none';
    document.getElementById('modal-media').innerHTML = '';
  }

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
    songs.forEach(song => container.appendChild(song.getCard()));

    document.getElementById('modal-close')
      .addEventListener('click', closeModal);

    document.getElementById('songModal')
      .addEventListener('click', (e) => {
        if (e.target.id === 'songModal') closeModal();
      });
  });

})();
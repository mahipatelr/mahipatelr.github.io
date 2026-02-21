// js/mood-player.js
// Modern arrow-function style, const/let, DOMContentLoaded

const songs = {
  Happy: {
    "Happy — Pharrell Williams": "https://www.youtube.com/embed/ZbZSe6N_BXs",
    "Don't Stop Me Now — Queen": "https://www.youtube.com/embed/HgzGwKwLmgM",
    "Can't Stop the Feeling — Justin Timberlake": "https://www.youtube.com/embed/ru0K8uYEZWw",
    "Don't Worry, Be Happy — Bobby McFerrin": "https://www.youtube.com/embed/d-diB65scQU",
    "I'm Walking on Sunshine — Katrina & The Waves": "https://www.youtube.com/embed/iPUmE-tne5U"
  },
  Sad: {
    "Happier Than Ever — Billie Eilish": "https://www.youtube.com/embed/1tq1_J3U0Y4",
    "Someone You Loved — Lewis Capaldi": "https://www.youtube.com/embed/bCuhuePlwK8",
    "Someone Like You — Adele": "https://www.youtube.com/embed/hLQl3WQQoQ0",
    "Fix You — Coldplay": "https://www.youtube.com/embed/k4V3Mo61fJM",
    "Hurt — Johnny Cash": "https://www.youtube.com/embed/8AHCfZTRGiI"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const moodSelect = document.getElementById("moodSelect");
  const songList = document.getElementById("songList");
  const playerArea = document.getElementById("playerArea");

  if (!moodSelect || !songList || !playerArea) {
    console.error("Missing DOM elements: moodSelect, songList or playerArea");
    return;
  }

  // Arrow function handlers
  const clearPlayer = () => {
    playerArea.innerHTML = "";
    playerArea.hidden = true;
    const prev = songList.querySelector("a.active");
    if (prev) prev.classList.remove("active");
  };

  const highlightActiveLink = (link) => {
    const prev = songList.querySelector("a.active");
    if (prev) prev.classList.remove("active");
    link.classList.add("active");
  };

  const showEmbed = (embedUrl, songName) => {
    playerArea.innerHTML = "";
    playerArea.hidden = false;

    // get video id and use youtube-nocookie as privacy-friendly domain
    const parts = embedUrl.split("/");
    const videoId = parts[parts.length - 1] || "";
    const nocookieSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;

    const wrap = document.createElement("div");
    wrap.className = "embed-wrap";

    const iframe = document.createElement("iframe");
    iframe.src = nocookieSrc;
    iframe.title = `YouTube player — ${songName}`;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;

    wrap.appendChild(iframe);
    playerArea.appendChild(wrap);

    // fallback watch link (useful if embedding is blocked)
    const watchWrap = document.createElement("div");
    watchWrap.style.marginTop = "8px";
    watchWrap.style.textAlign = "center";

    const watchLink = document.createElement("a");
    watchLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    watchLink.target = "_blank";
    watchLink.rel = "noopener noreferrer";
    watchLink.textContent = "Watch on YouTube";
    watchLink.className = "watch-link";
    watchWrap.appendChild(watchLink);
    playerArea.appendChild(watchWrap);

    wrap.scrollIntoView({ behavior: "smooth", block: "center" });
    console.log("Showed embed (nocookie) for:", songName, videoId);
  };

  const renderSongListForMood = (mood) => {
    songList.innerHTML = "";
    if (!mood || !songs[mood]) {
      console.log("No songs available for mood:", mood);
      return;
    }

    const list = songs[mood];
    Object.keys(list).forEach((songName) => {
      const a = document.createElement("a");
      a.href = "#";
      a.dataset.embed = list[songName];
      a.textContent = songName;
      a.addEventListener("click", (evt) => {
        evt.preventDefault();
        highlightActiveLink(a);
        showEmbed(a.dataset.embed, songName);
      });
      songList.appendChild(a);
    });

    console.log(`Rendered ${Object.keys(list).length} songs for mood "${mood}"`);
  };

  // Mood select change event
  moodSelect.addEventListener("change", (e) => {
    const mood = e.target.value;
    console.log("Mood selected:", mood);
    clearPlayer();
    renderSongListForMood(mood);
  });

  // If the select already has a value when the page loads, render it
  if (moodSelect.value) {
    console.log("Initial mood detected:", moodSelect.value);
    renderSongListForMood(moodSelect.value);
  }

  // Expose debug helpers (convenient while developing)
  window._moodDebug = {
    render: (m) => renderSongListForMood(m),
    show: (url, name) => showEmbed(url, name)
  };
});
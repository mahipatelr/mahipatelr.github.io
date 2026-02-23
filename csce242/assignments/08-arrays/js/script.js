// js/script.js
// Mood player using associative objects (maps).
// Keys: displayed song names. Values: youtube embed URLs (for <iframe src="...">).

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

// DOM refs
const moodSelect = document.getElementById("moodSelect");
const songList = document.getElementById("songList");
const playerArea = document.getElementById("playerArea");

let currentMood = "";
let currentSongLink = null;

// Build song list when mood changes
moodSelect.addEventListener("change", (e) => {
  const mood = e.target.value;
  clearPlayer();
  renderSongListForMood(mood);
});

function renderSongListForMood(mood) {
  songList.innerHTML = ""; // clear
  currentMood = mood;

  if (!mood || !songs[mood]) {
    // If no valid mood selected, show nothing
    return;
  }

  const list = songs[mood];
  // Create nicely formatted links
  Object.keys(list).forEach((songName, idx) => {
    const a = document.createElement("a");
    a.href = "#";
    a.dataset.embed = list[songName]; // embed url
    a.textContent = songName;
    a.setAttribute("role", "button");
    a.addEventListener("click", (evt) => {
      evt.preventDefault();
      // highlight
      highlightActiveLink(a);
      showEmbed(a.dataset.embed, songName);
    });
    songList.appendChild(a);
  });
}

function highlightActiveLink(link) {
  // remove previous active
  const prev = songList.querySelector("a.active");
  if (prev) prev.classList.remove("active");
  link.classList.add("active");
}

function showEmbed(embedUrl, songName) {
  // remove existing iframe and show new one
  playerArea.innerHTML = "";
  playerArea.hidden = false;

  const wrap = document.createElement("div");
  wrap.className = "embed-wrap";

  // build iframe
  const iframe = document.createElement("iframe");
  iframe.src = embedUrl + "?rel=0"; // add param to avoid related videos from other channels
  iframe.title = `YouTube player — ${songName}`;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  wrap.appendChild(iframe);
  playerArea.appendChild(wrap);

  // smooth scroll to player for better UX
  wrap.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearPlayer() {
  playerArea.innerHTML = "";
  playerArea.hidden = true;
  // clear active link if any
  const prev = songList.querySelector("a.active");
  if (prev) prev.classList.remove("active");
}
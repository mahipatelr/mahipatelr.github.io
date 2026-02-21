const songs = {
  Happy: {
    "Happy — Pharrell Williams": "https://www.youtube.com/embed/ZbZSe6N_BXs",
    "Don't Stop Me Now — Queen": "https://www.youtube.com/embed/HgzGwKwLmgM",
    "Can't Stop the Feeling — Justin Timberlake": "https://www.youtube.com/embed/ru0K8uYEZWw",
    "Don't Worry, Be Happy — Bobby McFerrin": "https://www.youtube.com/embed/d-diB65scQU",
    "I'm Walking on Sunshine — Katrina & The Waves": "https://www.youtube.com/embed/iPUmE-tne5U"
  },
  Sad: {
    "Happier Than Ever — Billie Eilish": "https://www.youtube.com/embed/5GJWxDKyk3A",
    "Someone You Loved — Lewis Capaldi": "https://www.youtube.com/embed/zABLecsR5UE",
    "Someone Like You — Adele": "https://www.youtube.com/embed/hLQl3WQQoQ0",
    "Fix You — Coldplay": "https://www.youtube.com/embed/k4V3Mo61fJM",
    "Hurt — Johnny Cash": "https://www.youtube.com/embed/8AHCfZTRGiI"
  }
};

const openOnly = new Set([
  "1tq1_J3U0Y4", 
  "5GJWxDKyk3A", 
  "zABLecsR5UE"  
]);

document.addEventListener("DOMContentLoaded", () => {
  const moodSelect = document.getElementById("moodSelect");
  const songList = document.getElementById("songList");
  const playerArea = document.getElementById("playerArea");

  if (!moodSelect || !songList || !playerArea) {
    console.error("Missing DOM elements: moodSelect, songList or playerArea");
    return;
  }

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

  
  const showThumbnailWithControls = (videoId, songName, openInNewTab = true) => {
    playerArea.innerHTML = "";
    playerArea.hidden = false;

    const youtubePage = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const container = document.createElement("div");
    container.style.maxWidth = "720px";
    container.style.width = "100%";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "10px";

    const thumbBox = document.createElement("div");
    thumbBox.style.position = "relative";
    thumbBox.style.width = "100%";
    thumbBox.style.paddingBottom = "56.25%";
    thumbBox.style.background = `url('${thumbUrl}') center/cover no-repeat`;
    thumbBox.style.borderRadius = "6px";
    thumbBox.style.cursor = "pointer";
    thumbBox.style.boxShadow = "0 6px 18px rgba(25,30,25,0.08)";

    const playOverlay = document.createElement("div");
    playOverlay.style.position = "absolute";
    playOverlay.style.left = "50%";
    playOverlay.style.top = "50%";
    playOverlay.style.transform = "translate(-50%, -50%)";
    playOverlay.style.width = "72px";
    playOverlay.style.height = "72px";
    playOverlay.style.borderRadius = "50%";
    playOverlay.style.background = "rgba(0,0,0,0.6)";
    playOverlay.style.display = "flex";
    playOverlay.style.alignItems = "center";
    playOverlay.style.justifyContent = "center";

    const triangle = document.createElement("div");
    triangle.style.width = "0";
    triangle.style.height = "0";
    triangle.style.borderLeft = "18px solid white";
    triangle.style.borderTop = "12px solid transparent";
    triangle.style.borderBottom = "12px solid transparent";
    playOverlay.appendChild(triangle);
    thumbBox.appendChild(playOverlay);

    
    thumbBox.addEventListener("click", () => {
      window.open(youtubePage, "_blank", "noopener");
    });

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "12px";
    controls.style.alignItems = "center";

    const embedBtn = document.createElement("button");
    embedBtn.textContent = "Embed here";
    embedBtn.style.cursor = "pointer";
    embedBtn.addEventListener("click", () => {
      
      embedVideoById(videoId, songName);
    });

    const watchLink = document.createElement("a");
    watchLink.href = youtubePage;
    watchLink.target = "_blank";
    watchLink.rel = "noopener noreferrer";
    watchLink.textContent = "Watch on YouTube";
    watchLink.className = "watch-link";

    controls.appendChild(embedBtn);
    controls.appendChild(watchLink);

    
    if (openOnly.has(videoId) || openInNewTab) {
      const msg = document.createElement("div");
      msg.style.fontSize = "0.95rem";
      msg.style.color = "#6b6b6b";
      msg.style.textAlign = "center";
      msg.style.maxWidth = "720px";
      msg.textContent = "Embedding appears to be blocked for this video — open it on YouTube or click 'Embed here' to try.";
      container.appendChild(thumbBox);
      container.appendChild(controls);
      container.appendChild(msg);
    } else {
      container.appendChild(thumbBox);
      container.appendChild(controls);
    }

    playerArea.appendChild(container);
    container.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  
  const embedVideoById = (videoId, songName) => {
    playerArea.innerHTML = "";
    playerArea.hidden = false;

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
    console.log("Tried to embed video:", videoId, songName);
  };

  const showEmbed = (embedUrl, songName) => {
    playerArea.innerHTML = "";
    playerArea.hidden = false;

    const parts = embedUrl.split("/");
    const videoId = parts[parts.length - 1] || "";

    if (!videoId) {
      console.warn("Could not determine video ID for", songName);
      return;
    }

    if (openOnly.has(videoId)) {
      console.log("Video marked open-only (will not attempt embed):", videoId);
      showThumbnailWithControls(videoId, songName, true);
      return;
    }

    showThumbnailWithControls(videoId, songName, false);
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

  moodSelect.addEventListener("change", (e) => {
    const mood = e.target.value;
    console.log("Mood selected:", mood);
    clearPlayer();
    renderSongListForMood(mood);
  });

  if (moodSelect.value) {
    console.log("Initial mood detected:", moodSelect.value);
    renderSongListForMood(moodSelect.value);
  }

  window._moodDebug = {
    render: (m) => renderSongListForMood(m),
    show: (url, name) => showEmbed(url, name),
    embedNow: (id, name) => embedVideoById(id, name)
  };
});

  
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

  
  moodSelect.addEventListener("change", (e) => {
    const mood = e.target.value;
    console.log("Mood selected:", mood);
    clearPlayer();
    renderSongListForMood(mood);
  });

  
  if (moodSelect.value) {
    console.log("Initial mood detected:", moodSelect.value);
    renderSongListForMood(moodSelect.value);
  }

  
  window._moodDebug = {
    render: (m) => renderSongListForMood(m),
    show: (url, name) => showEmbed(url, name)
  };

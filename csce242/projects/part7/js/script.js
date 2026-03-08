(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        mobileMenu.setAttribute('aria-hidden', !isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
      });
    }

    const grid = document.getElementById('lessonGrid');
    const addBtn = document.getElementById('addToGallery');

    if (!grid || !addBtn) return;

    function createPreviewCard() {
      const previewCard = document.createElement('div');
      previewCard.className = 'preview-card';
      previewCard.setAttribute('role', 'region');

      const h = document.createElement('h4');
      h.textContent = 'Preview';

      const p = document.createElement('p');
      p.textContent = 'This is a preview. Click the card to open the lesson.';

      previewCard.appendChild(h);
      previewCard.appendChild(p);
      return previewCard;
    }

    function createPreviewLink(openLabel) {
      const span = document.createElement('span');
      span.className = 'preview-link';
      span.style.width = '100%';
      span.style.display = 'inline-block';
      span.style.textAlign = 'center';

      const openDiv = document.createElement('div');
      openDiv.className = 'btn primary';
      openDiv.style.display = 'inline-block';
      openDiv.style.cursor = 'pointer';
      openDiv.textContent = openLabel || 'Open';

      span.appendChild(openDiv);
      span.appendChild(createPreviewCard());
      return span;
    }

    function createLessonCard({ title, desc, img, href }) {
      const a = document.createElement('a');
      a.className = 'lesson-card';
      a.href = href || '#';

      a.setAttribute('data-title', title || '');
      a.setAttribute('data-desc', desc || '');
      a.setAttribute('data-img', img || '');

      const imgEl = document.createElement('img');
      imgEl.src = img || '../../images/getting-started.png';
      imgEl.alt = title || '';

      const h4 = document.createElement('h4');
      h4.textContent = title || '';

      const p = document.createElement('p');
      p.textContent = desc || '';

      a.appendChild(imgEl);
      a.appendChild(h4);
      a.appendChild(p);
      a.appendChild(createPreviewLink('Open'));

      return a;
    }

    addBtn.addEventListener('click', function () {
      const title = prompt('Lesson title (e.g. "Saving 101")');
      if (!title) return;

      const desc = prompt('Short description') || '';
      const img = prompt('Image path (relative) or leave empty') || '../../images/getting-started.png';
      const href = prompt('Target link (e.g. wallet.html) — where should this card go?') || 'wallet.html';

      const card = createLessonCard({
        title: title.trim(),
        desc: desc.trim(),
        img: img.trim(),
        href: href.trim()
      });

      grid.appendChild(card);
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

  });
})();



const showTransactions = async () => {
  const response = await fetch("https://mahipatelr.github.io/csce242/json/transactions.json");
  const transactions = await response.json();

  const tbody = document.getElementById("transactions-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  transactions.forEach(t => {
    const sign = t.amount < 0 ? '-' : '+';
    const cls = t.amount < 0 ? 'negative' : 'positive';

    tbody.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.merchant}</td>
        <td>${t.category}</td>
        <td class="amount ${cls}">${sign}$${Math.abs(t.amount).toFixed(2)}</td>
      </tr>
    `;
  });
};


window.onload = showTransactions;
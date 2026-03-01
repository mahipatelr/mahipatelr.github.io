// js/script.js
// Minimal JS: hamburger toggle + Add-to-Gallery that creates linked lesson cards.
// No lightbox. Cards are normal <a href="..."> links so clicking navigates.

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // Hamburger toggle
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

    // Gallery add behavior
    const grid = document.getElementById('lessonGrid');
    const addBtn = document.getElementById('addToGallery');

    if (!grid || !addBtn) return;

    // helper: create preview-card element (used inside preview-link)
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

    // helper: create 'Open' preview wrapper used in each card
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

    // create a lesson card anchor (links to a page)
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

    // Add-to-gallery click: prompt for information and append a linked card
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

    // nothing else necessary — cards are anchors so they navigate naturally
  });
})();
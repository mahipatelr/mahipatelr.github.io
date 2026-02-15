// nav.js — toggle nav for small screens and wire menu items to sections

document.getElementById("toggle-nav").onclick = () => {
    const list = document.querySelector("#main-nav ul");
    // If hide-small present, remove it and add open to show vertical list
    if (list.classList.contains('hide-small')) {
        list.classList.remove('hide-small');
        list.classList.add('open');
        document.getElementById("toggle-nav").setAttribute('aria-expanded','true');
    } else if (list.classList.contains('open')) {
        list.classList.remove('open');
        list.classList.add('hide-small');
        document.getElementById("toggle-nav").setAttribute('aria-expanded','false');
    } else {
        // fallback: toggle hide-small
        list.classList.toggle('hide-small');
    }
};

// Close mobile menu helper
function closeMobileMenu() {
    const list = document.querySelector("#main-nav ul");
    if (list.classList.contains('open')) {
        list.classList.remove('open');
        list.classList.add('hide-small');
        document.getElementById("toggle-nav").setAttribute('aria-expanded','false');
    }
}

// Wire nav anchors to show the two exercise sections (no page navigation)
const navAnchors = document.querySelectorAll('#mainNavList a');
navAnchors.forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = a.getAttribute('data-target');
        if (targetId) {
            // show the chosen section and hide the other
            const sections = ['exercise1-section','exercise2-section'];
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.style.display = (id === targetId) ? '' : 'none';
            });
            // close mobile menu after selection
            closeMobileMenu();
        }
    });
});




// projects/part7/js/contact.js
// Contact form handler (professor style) — uses window.onload

// Replace this with your Formspree endpoint (example: "https://formspree.io/f/abcd1234")
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID";

window.onload = function () {
  const form = document.getElementById('contact-form');
  const resultEl = document.getElementById('contact-result');
  if (!form || !resultEl) return; // nothing to do

  // Helper to escape text safely for injection
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, ch =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])
    );
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      resultEl.style.color = "#ff9aa2";
      resultEl.textContent = "Please complete the required fields.";
      return;
    }

    // Ensure endpoint is configured
    if (!FORM_ENDPOINT || FORM_ENDPOINT.includes('YOUR_FORMSPREE_ID')) {
      resultEl.style.color = "#ff9aa2";
      resultEl.textContent = "Form not configured. Replace FORM_ENDPOINT in js/contact.js with your Formspree URL.";
      return;
    }

    resultEl.style.color = "";
    resultEl.textContent = "Sending…";

    try {
      const formData = new FormData(form);

      const resp = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (resp.ok) {
        resultEl.style.color = "#8ff2a6";
        resultEl.textContent = "Message sent — thank you! I will reply soon.";
        form.reset();
      } else {
        let data;
        try { data = await resp.json(); } catch (_) { data = null; }
        const msg = data && data.error ? data.error : `HTTP ${resp.status}`;
        resultEl.style.color = "#ff9aa2";
        resultEl.textContent = "Failed to send: " + escapeHtml(msg);
      }
    } catch (err) {
      console.error("Contact form error:", err);
      resultEl.style.color = "#ff9aa2";
      resultEl.textContent = "Network error. Please try again.";
    }
  });
};
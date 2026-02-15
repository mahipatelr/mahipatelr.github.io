const $ = (selector) => document.querySelector(selector);

const init = () => {
  setupTriangle();
  setupDate();
  setupImage();
};


const setupTriangle = () => {
  const box = $('#triangle-container');

  const toggle = () => {
    const isOn = box.classList.toggle('show');
    box.setAttribute('aria-pressed', isOn);
  };

  box.addEventListener('click', toggle);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
};


const setupDate = () => {
  const input = $('#date-picker');
  const output = $('#date-output');

  input.addEventListener('change', () => {
    if (!input.value) {
      output.textContent = '';
      return;
    }
    const [y, m, d] = input.value.split('-');
    output.textContent = `You picked the date: ${m}/${d}/${y}`;
  });
};


const setupImage = () => {
  const img = $('#image-wrap');

  const toggle = () => {
    const isOn = img.classList.toggle('framed');
    img.setAttribute('aria-pressed', isOn);
  };

  img.addEventListener('click', toggle);
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
};

document.addEventListener('DOMContentLoaded', init);








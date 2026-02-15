/* Assignment JS: slider messages and countdown */

// SLIDER (Exercise 1)
document.getElementById('rangeMinutes').oninput = function(e) {
    const v = e.currentTarget.value;
    document.getElementById('rangeValue').textContent = `${v} minute${v === '1' ? '' : 's'}`;

    const n = Number(v);
    let msg = '';
    if (n > 45) {
        msg = '🥓 More than 45 minutes — let\'s have bacon and eggs!';
    } else if (n > 30) {
        msg = '🍳 Between 30 and 45 minutes — time to cook something nice!';
    } else if (n > 15) {
        msg = '☕ Between 15 and 30 minutes — perfect for a coffee and review.';
    } else {
        msg = '🏃 Less than 15 minutes — hurry up, grab your bag!';
    }
    document.getElementById('rangeMessage').innerHTML = msg;
};

// set initial slider UI on load
(function initSlider() {
    const r = document.getElementById('rangeMinutes');
    if (r) {
        const v = r.value;
        document.getElementById('rangeValue').textContent = `${v} minute${v === '1' ? '' : 's'}`;
    }
})();


// COUNTDOWN (Exercise 2) — class assumed at 8:30 AM today
function updateCountdown() {
    const now = new Date();
    let classTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0, 0);

    // If you want the next 8:30 (tomorrow) uncomment below:
    // if (now > classTime) { classTime.setDate(classTime.getDate() + 1); }

    const diffMs = classTime - now;
    const diffMin = Math.round(diffMs / 60000);
    let text = '';

    if (diffMin > 15) {
        text = `You have ${diffMin} minutes until class — plenty of time ☕.`;
    } else if (diffMin > 10) {
        text = `Between 10 and 15 minutes — about ${diffMin} minutes left 🚶.`;
    } else if (diffMin > 5) {
        text = `Between 5 and 10 minutes — only ${diffMin} minutes — time to hurry! 🏃`;
    } else if (diffMin >= 0) {
        text = `${diffMin} minutes until class — run! 🏃‍♀️`;
    } else {
        const ago = Math.abs(diffMin);
        if (ago <= 5) {
            text = `Class started ${ago} minute${ago === 1 ? '' : 's'} ago — sneak in quietly 🤫.`;
        } else if (ago <= 15) {
            text = `Class started ${ago} minutes ago — you missed a bit 😬.`;
        } else {
            text = `Class started ${ago} minutes ago — catch the recording and review 📚.`;
        }
    }

    const out = document.getElementById('countdownResult');
    if (out) out.innerHTML = text;
}

// run immediately and update every 20s
updateCountdown();
setInterval(updateCountdown, 20 * 1000);




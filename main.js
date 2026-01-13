class TimerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .time-display {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                input {
                    width: 50px;
                    font-size: 2em;
                    text-align: center;
                    border: none;
                    background: transparent;
                    color: var(--text-color, #333);
                    border-bottom: 2px solid var(--input-border, #ccc);
                    margin: 0 5px;
                    transition: color 0.3s;
                }
                span {
                    font-size: 2em;
                }
            </style>
            <div class="time-display">
                <input type="number" id="hours" value="0" min="0">
                <span>:</span>
                <input type="number" id="minutes" value="0" min="0" max="59">
                <span>:</span>
                <input type="number" id="seconds" value="0" min="0" max="59">
            </div>
        `;

        this.hoursInput = this.shadowRoot.querySelector('#hours');
        this.minutesInput = this.shadowRoot.querySelector('#minutes');
        this.secondsInput = this.shadowRoot.querySelector('#seconds');
    }

    getTimeInSeconds() {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        return hours * 3600 + minutes * 60 + seconds;
    }

    setTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        this.hoursInput.value = hours;
        this.minutesInput.value = minutes;
        this.secondsInput.value = seconds;
    }
}

customElements.define('timer-component', TimerComponent);

const timer = document.querySelector('timer-component');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const presets = document.querySelector('.presets');
const toggleSoundBtn = document.getElementById('toggle-sound');
const toggleThemeBtn = document.getElementById('toggle-theme');
const alarmSound = document.getElementById('alarm-sound');
const animationContainer = document.getElementById('animation-container');

let intervalId = null;
let remainingTime = 0;
let soundEnabled = true;

// --- Animation ---
const horseSvg = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 150 Q70 100 100 120 T150 100 Q170 120 150 150 L140 170 L130 160 L120 170 L110 160 L100 170 L90 160 L80 170 L70 160 L60 170 Z" fill="none" stroke="var(--text-color)" stroke-width="2" />
  <path d="M100 120 L100 80 Q110 60 120 80 L120 120" fill="none" stroke="var(--text-color)" stroke-width="2" />
  <circle cx="110" cy="75" r="3" fill="var(--text-color)" />
</svg>
`;
animationContainer.innerHTML = horseSvg;

function startTimer() {
    if (intervalId) return;
    remainingTime = timer.getTimeInSeconds();
    if (remainingTime <= 0) return;

    animationContainer.style.display = 'block';
    intervalId = setInterval(() => {
        remainingTime--;
        timer.setTime(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            animationContainer.style.display = 'none';
            if (soundEnabled) {
                alarmSound.play();
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    animationContainer.style.display = 'none';
}

function resetTimer() {
    stopTimer();
    timer.setTime(0);
}

// --- Event Listeners ---
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

presets.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const time = parseInt(e.target.dataset.time);
        timer.setTime(time);
    }
});

toggleSoundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleSoundBtn.textContent = `Sound: ${soundEnabled ? 'On' : 'Off'}`;
});

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeBtn.textContent = `Theme: ${isDarkMode ? 'Dark' : 'Light'}`;
});
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
const stickFigureAnimation = document.getElementById('stick-figure-animation');

let intervalId = null;
let remainingTime = 0;
let soundEnabled = true;
let userInteracted = false;

function unlockAudio() {
    if (userInteracted) return;
    alarmSound.play();
    alarmSound.pause();
    alarmSound.currentTime = 0;
    userInteracted = true;
}

function updateButtonVisibility(isTimerRunning) {
    startBtn.classList.toggle('hidden', isTimerRunning);
    resetBtn.classList.toggle('hidden', isTimerRunning);
    stopBtn.classList.toggle('hidden', !isTimerRunning);
}

function startTimer() {
    if (intervalId) return;
    remainingTime = timer.getTimeInSeconds();
    if (remainingTime <= 0) return;

    updateButtonVisibility(true);
    animationContainer.style.display = 'block'; // Show the parent container
    intervalId = setInterval(() => {
        remainingTime--;
        timer.setTime(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            animationContainer.style.display = 'none'; // Hide the parent container
            updateButtonVisibility(false);
            if (soundEnabled) {
                alarmSound.play();
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    animationContainer.style.display = 'none'; // Hide the parent container
    updateButtonVisibility(false);
}

function resetTimer() {
    stopTimer();
    timer.setTime(0);
}

// --- Event Listeners ---
document.body.addEventListener('click', unlockAudio, { once: true });

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
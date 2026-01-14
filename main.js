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
                    width: 120px; /* Adjusted width for two digits */
                    text-align: center;
                    border: none;
                    background: transparent;
                    color: var(--text-color, #333);
                    border-bottom: 2px solid var(--input-border, #ccc);
                    margin: 0 5px;
                    transition: color 0.3s;
                    font-size: 64px; /* Base font size */
                }
                span {
                    font-size: 64px; /* Base font size */
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
const pauseBtn = document.getElementById('pause'); // Renamed from stopBtn
const resetBtn = document.getElementById('reset');
const presets = document.querySelector('.presets');
const toggleSoundBtn = document.getElementById('toggle-sound');
const toggleThemeBtn = document.getElementById('toggle-theme');
const alarmSound = document.getElementById('alarm-sound');
const animationContainer = document.getElementById('animation-container');
const mouseAnimation = document.getElementById('mouse-animation');

let intervalId = null;
let remainingTime = 0;
let soundEnabled = true;
let userInteracted = false;
let lastSetTime = 0; // Stores the initial set time
let isPaused = false; // New state to track if timer is paused

function unlockAudio() {
    if (userInteracted) return;
    alarmSound.play();
    alarmSound.pause();
    alarmSound.currentTime = 0;
    userInteracted = true;
}

function updateButtonVisibility(state) { // 'initial', 'running', 'paused', 'finished', 'alarmRinging'
    document.body.classList.remove('timer-running', 'alarm-ringing'); // Clear all state classes first
    
    // Explicitly hide all buttons first
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    stopAlarmBtn.style.display = 'none';

    switch (state) {
        case 'initial':
        case 'finished':
            startBtn.style.display = 'inline-block';
            startBtn.textContent = 'Start';
            resetBtn.style.display = 'inline-block';
            break;
        case 'running':
            pauseBtn.style.display = 'inline-block'; // Pause button is visible when running
            document.body.classList.add('timer-running');
            break;
        case 'paused':
            startBtn.style.display = 'inline-block';
            startBtn.textContent = 'Resume';
            resetBtn.style.display = 'inline-block';
            document.body.classList.remove('timer-running');
            break;
        case 'alarmRinging':
            stopAlarmBtn.style.display = 'inline-block'; // Stop Alarm button is visible
            document.body.classList.add('alarm-ringing');
            break;
    }
}

function startTimer() {
    if (intervalId) return; // Timer is already running

    if (!isPaused) {
        lastSetTime = timer.getTimeInSeconds(); // Store the initial time only if not resuming
        remainingTime = lastSetTime;
    }
    
    if (remainingTime <= 0) {
        resetTimer(); // If starting with 0, reset everything and don't start timer
        return;
    }

    isPaused = false; // Timer is no longer paused

    updateButtonVisibility('running');
    animationContainer.style.display = 'block';

    const inputs = timer.shadowRoot.querySelectorAll('input');
    const spans = timer.shadowRoot.querySelectorAll('span');
    inputs.forEach(input => {
        input.style.fontSize = '120px';
        input.style.width = '240px'; // Adjust width for 120px font
    });
    spans.forEach(span => span.style.fontSize = '120px');

    intervalId = setInterval(() => {
        remainingTime--;
        timer.setTime(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            animationContainer.style.display = 'none';
            if (soundEnabled) {
                alarmSound.loop = true; // Loop the alarm
                alarmSound.play();
            }
            updateButtonVisibility('finished'); // Timer finished
            isPaused = false;
            // Reset font size and width to base
            inputs.forEach(input => {
                input.style.fontSize = '64px';
                input.style.width = '120px'; // Revert width
            });
            spans.forEach(span => span.style.fontSize = '64px');
        }
    }, 1000);
}

function pauseTimer() { // Renamed from stopTimer for clarity
    clearInterval(intervalId);
    intervalId = null;
    animationContainer.style.display = 'none';
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmSound.loop = false; // Stop looping

    isPaused = true; // Mark timer as paused

    updateButtonVisibility('paused');

    // Revert font size and width to base
    const inputs = timer.shadowRoot.querySelectorAll('input');
    const spans = timer.shadowRoot.querySelectorAll('span');
    inputs.forEach(input => {
        input.style.fontSize = '64px';
        input.style.width = '120px'; // Revert width
    });
    spans.forEach(span => span.style.fontSize = '64px');
}

function resetTimer() {
    pauseTimer(); // This will also pause the timer and revert styles
    timer.setTime(0); // Then reset to 0
    lastSetTime = 0;
    remainingTime = 0; // Ensure remainingTime is reset
    isPaused = false; // Not paused if reset
    updateButtonVisibility('initial'); // Ensure correct button state
}

// --- Event Listeners ---
document.body.addEventListener('click', unlockAudio, { once: true });

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer); // Updated event listener
resetBtn.addEventListener('click', resetTimer);

presets.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const time = parseInt(e.target.dataset.time);
        timer.setTime(time);
        lastSetTime = time; // Update lastSetTime when a preset is selected
        remainingTime = time; // Update remainingTime for potential resume
        isPaused = false; // Not paused if new preset selected
        updateButtonVisibility('initial'); // Ensure correct button state
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
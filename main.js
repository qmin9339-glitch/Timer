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

document.addEventListener('DOMContentLoaded', () => {
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
    const stopAlarmBtn = document.getElementById('stop-alarm'); // New constant for Stop Alarm button
    const pauseContainer = document.getElementById('pause-container');

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

    function updateButtonVisibility(state) {
        const isRunning = state === 'running';
        const isAlarming = state === 'alarmRinging';
        const isPausedState = state === 'paused';
        const isInitial = state === 'initial' || state === 'finished';

        // Manage visibility of button containers
        document.getElementById('timer-main-controls').style.display = (isInitial || isPausedState) ? 'block' : 'none';
        pauseContainer.style.display = isRunning ? 'block' : 'none';

        // Manage individual buttons
        startBtn.style.display = (isInitial || isPausedState) ? 'inline-block' : 'none';
        resetBtn.style.display = (isInitial || isPausedState) ? 'inline-block' : 'none';
        stopAlarmBtn.style.display = isAlarming ? 'inline-block' : 'none';

        // Hide main controls when alarm is ringing and show only stop alarm
        if (isAlarming) {
            document.getElementById('timer-main-controls').style.display = 'block';
            startBtn.style.display = 'none';
            resetBtn.style.display = 'none';
        }

        // Update body classes
        document.body.classList.toggle('timer-running', isRunning);
        document.body.classList.toggle('alarm-ringing', isAlarming);

        // Update Start/Resume text
        startBtn.textContent = isPausedState ? 'Resume' : 'Start';
    }

    function startTimer() {
        if (intervalId) return; // Timer is already running

        if (!isPaused) {
            lastSetTime = timer.getTimeInSeconds(); // Store the initial time only if not resuming
            remainingTime = lastSetTime;
        }
        
        // Only start if there's time remaining OR if it's a resume from pause.
        // If remainingTime is 0 and it's not a resume, it means no time is set.
        if (remainingTime <= 0 && !isPaused) {
            // If no time is set and it's a fresh start, do not start the timer.
            // Ensure buttons are in the initial state.
            updateButtonVisibility('initial');
            timer.setTime(0); // Display 00:00:00
            lastSetTime = 0;
            return;
        }

        isPaused = false; // Timer is no longer paused
        timer.shadowRoot.querySelectorAll('input').forEach(input => input.disabled = true);
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
                                    updateButtonVisibility('alarmRinging'); // Show Stop Alarm button
                                } else {
                                    updateButtonVisibility('finished'); // Timer finished, no alarm
                                }
                                isPaused = false;
                                timer.shadowRoot.querySelectorAll('input').forEach(input => input.disabled = false);
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
                        timer.shadowRoot.querySelectorAll('input').forEach(input => input.disabled = false);
                
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
                
                    function stopAlarm() {
                        alarmSound.pause();
                        alarmSound.currentTime = 0;
                        alarmSound.loop = false;
                        updateButtonVisibility('initial'); // Go back to initial state
                        timer.shadowRoot.querySelectorAll('input').forEach(input => input.disabled = false);
                    }
                
                    function resetTimer() {
                        pauseTimer(); // This will also pause the timer and revert styles
                        timer.setTime(0); // Then reset to 0
                        lastSetTime = 0;
                        remainingTime = 0; // Ensure remainingTime is reset
                        isPaused = false; // Not paused if reset
                        updateButtonVisibility('initial'); // Ensure correct button state
                        timer.shadowRoot.querySelectorAll('input').forEach(input => input.disabled = false);
                    }
                
                    // --- Event Listeners ---
                    document.body.addEventListener('click', unlockAudio, { once: true });
                
                    startBtn.addEventListener('click', startTimer);
                    pauseBtn.addEventListener('click', pauseTimer); // Updated event listener
                    resetBtn.addEventListener('click', resetTimer);
                    stopAlarmBtn.addEventListener('click', stopAlarm); // New event listener
                
                    presets.addEventListener('click', (e) => {
                        if (e.target.tagName === 'BUTTON') {
                            const time = parseInt(e.target.dataset.time);
                            lastSetTime = time; // Update lastSetTime when a preset is selected
                            remainingTime = time; // Update remainingTime for potential resume
                            isPaused = false; // Not paused if new preset selected
                            updateButtonVisibility('initial'); // Use updateButtonVisibility for consistent state
                            timer.setTime(time); // Ensure timer display is updated
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
});
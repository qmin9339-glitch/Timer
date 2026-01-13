class TimerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
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

let intervalId = null;
let remainingTime = 0;

function startTimer() {
    if (intervalId) return; 
    remainingTime = timer.getTimeInSeconds();
    if (remainingTime <= 0) return;

    intervalId = setInterval(() => {
        remainingTime--;
        timer.setTime(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
}

function resetTimer() {
    stopTimer();
    timer.setTime(0);
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

presets.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const time = parseInt(e.target.dataset.time);
        timer.setTime(time);
    }
});
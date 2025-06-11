class Stopwatch {
    constructor(displayElement, lapsContainer) {
        this.displayElement = displayElement;
        this.lapsContainer = lapsContainer;
        this.running = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timer = null;
        this.laps = [];
    }

    start() {
        if (!this.running) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timer = setInterval(() => this.updateDisplay(), 10);
            this.running = true;
        }
    }

    pause() {
        if (this.running) {
            clearInterval(this.timer);
            this.elapsedTime = Date.now() - this.startTime;
            this.running = false;
        }
    }

    reset() {
        clearInterval(this.timer);
        this.running = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapsDisplay();
    }

    lap() {
        if (this.running) {
            const lapTime = this.formatTime(Date.now() - this.startTime);
            this.laps.unshift(lapTime);
            this.updateLapsDisplay();
        }
    }

    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        this.displayElement.textContent = this.formatTime(this.elapsedTime);
    }

    formatTime(milliseconds) {
        const date = new Date(milliseconds);
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const centiseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        return `${minutes}:${seconds}.${centiseconds}`;
    }

    updateLapsDisplay() {
        this.lapsContainer.innerHTML = '';
        this.laps.forEach((lap, index) => {
            const li = document.createElement('li');
            li.textContent = `Lap ${this.laps.length - index}: ${lap}`;
            this.lapsContainer.appendChild(li);
        });
    }
}

// Initialize the stopwatch
const display = document.querySelector('.display');
const lapsList = document.getElementById('laps');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');

const stopwatch = new Stopwatch(display, lapsList);

// Event listeners
startPauseBtn.addEventListener('click', () => {
    if (stopwatch.running) {
        stopwatch.pause();
        startPauseBtn.textContent = 'Start';
        lapBtn.disabled = true;
    } else {
        stopwatch.start();
        startPauseBtn.textContent = 'Pause';
        lapBtn.disabled = false;
    }
});

resetBtn.addEventListener('click', () => {
    stopwatch.reset();
    startPauseBtn.textContent = 'Start';
    lapBtn.disabled = true;
});

lapBtn.addEventListener('click', () => {
    stopwatch.lap();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        startPauseBtn.click();
    } else if (e.code === 'KeyL') {
        lapBtn.click();
    } else if (e.code === 'KeyR') {
        resetBtn.click();
    }
});
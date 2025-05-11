let sound;
let isInitialised = false;
let isLoaded = false;
let fft;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/aesthetic-137785.mp3', () => {
        console.log("sound is loaded!");
        isLoaded = true;
    });
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(1800, 1100); 
    textAlign(CENTER);
    textSize(48);
    fft = new p5.FFT();
    background(0);
}

function draw() {
    background(0);

    if (!sound.isPlaying()) {
        fill(255);
        text("Press any key to play sound", width / 2, height / 2);
    }

    if (sound.isPlaying()) {
        let freqs = fft.analyze();
        let step = 5;
        let maxFreq = freqs.length / 4; // отображаем только нижнюю часть спектра
        let barWidth = width / (maxFreq / step);

        noStroke();
        fill(0, 255, 0);

        for (let i = 2; i < maxFreq - 2; i += step) {
            let sum = 0;
            for (let j = -2; j <= 2; j++) {
                sum += freqs[i + j];
            }
            let avg = sum / 5;

            let barHeight = map(avg, 0, 255, 0, height);
            let x = map(i, 0, maxFreq, 0, width);

            rect(x, height - barHeight, barWidth, barHeight);
        }

        // красный кружок - бас
        let bass = fft.getEnergy("bass");
        fill("#FF0000");
        ellipse(width / 4, height / 4, max(50, bass), max(50, bass));

        // синий кружок - высокие
        let treble = fft.getEnergy("highMid");
        fill("#0000FF");
        ellipse(width * 3 / 4, height / 4, max(10, treble), max(10, treble));
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
        let r = map(mouseX, 0, width, 0.5, 2.0);
        if (isLoaded) {
            sound.loop(0, r);
        }
    } else {
        if (key === ' ') {
            if (sound.isPaused()) sound.play();
            else sound.pause();
        }
    }
}

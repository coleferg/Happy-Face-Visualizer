var w = window.outerWidth;
var h = window.outerHeight;
let sound = null;
let amplitude = null;
var context = new AudioContext();
var oscillators = {};
var midi, data;
var dater;
var oldDater;
var currentColor = '#CCCCCC';

var size    = 128;
var rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = "#"+ red + green + blue;
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

console.log(rainbow)

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn("No MIDI support in your browser");
}
function onMIDISuccess(midiData) {
  console.log(midiData);
  midi = midiData;
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = onMIDImessage;
  }
}
function onMIDIFailure() {
  console.warn("Not finding a MIDI controller");
}

function onMIDImessage(messageData) {
    dater = messageData.data;
}

function preload(){
  soundFormats('mp3', 'ogg');
  sound = new p5.SoundFile('./Jelly Sniffin!.mp3', (foo) => {
     console.log(foo)
     foo.play();
  }, ()=> {
    return console.log('error')
  }, () => {
    return console.log('loading sound bitch')
  });
}

function setup() {
  createCanvas(w, h);
  analyzer = new p5.Amplitude();
  analyzer.setInput(sound);
  fft = new p5.FFT();
  fft.setInput(sound);
}

function draw() {
  if (dater){
    if (dater[0] === 176 && dater[1] === 1) {
      currentColor = rainbow[dater[2]];
    }
  }
  micLevel = analyzer.getLevel();
  // background(0, micLevel * 200, micLevel * 255)
  if (mouseIsPressed) {
    fill(0, 200, constrain(height-micLevel*height*5, 0, height));
    console.log('pressed')
  } else {
    fill(currentColor);
  }
  var spectrum = fft.analyze();
  beginShape();
  for (i = 0; i<spectrum.length; i++) {
   vertex(i, map(spectrum[i], 0, 255, height, 0) );
  }
  endShape();
  let m = millis();
  m = Math.floor(m / 10)
  if(m > w) {
    m = m - w;
  }
  // ellipse(w / 2, h / 2,  10+micLevel*2000, 10+micLevel*2000);  
  // ellipse(w - mouseX, h - mouseY, w/5, w/5);
  // ellipse(mouseX, mouseY, w/10, w/10);
  console.log(oldDater, dater)
  if (dater) {
    if (!oldDater && dater[0] === 144) {
      oldDater = dater;
    }
    if (oldDater && oldDater[2] > 0 && dater[2] === 0 && oldDater[1] === dater[1]) {
      ellipse(w / 2, (oldDater[2]/127)*h,  ((oldDater[1] / 2) / 120) * h, ((oldDater[1] / 2) / 120) * h);
    } else if (dater[2] > 0) {
      ellipse(w / 2, (oldDater[2]/127)*h,  (oldDater[1] / 120) * h, (oldDater[1] / 120) * h);
    }
    if (dater[0] === 144) {
      oldDater = dater;
    }
  }
}
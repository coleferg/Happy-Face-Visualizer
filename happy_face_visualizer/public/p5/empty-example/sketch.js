let w = window.outerWidth;
let h = window.outerHeight;
let wC = window.outerWidth;
let hC = window.outerHeight;
let sound = null;
let sound2 = null;
let amplitude = null;
var context = new AudioContext();
var oscillators = {};
var midi, data;
var dater;
var oldDater;
var color1 = '#CCCCCC';
var color2 = '#AAAAAA';
var color3 = '#FFFFFF';
var color4 = '#EEEEEE';
var color5 = '#000000';
const notes = {
  'note36': 0,
  'note37': 0,
  'note38': 0,
  'note39': 0,
  'note40': 0,
  'note41': 0,
  'note42': 0,
  'note43': 0,
  'note44': 0,
  'note45': 0,
  'note46': 0,
  'note47': 0,
  'note48': 0,
  'note49': 0,
  'note50': 0,
  'note51': 0,
  'note52': 0,
  'note53': 0,
  'note54': 0,
  'note55': 0,
  'note56': 0,
  'note57': 0,
  'note58': 0,
  'note59': 0,
  'note60': 0,
  'note61': 0,
  'note62': 0,
  'note63': 0,
  'note64': 0,
  'note65': 0,
  'note66': 0,
  'note67': 0,
  'note68': 0,
  'note69': 0,
  'note70': 0,
  'note71': 0,
  'note72': 0,
  'note73': 0,
  'note74': 0,
  'note75': 0,
  'note76': 0,
  'note77': 0,
  'note78': 0,
  'note79': 0,
  'note80': 0,
  'note81': 0,
  'note82': 0,
  'note83': 0,
  'note84': {
    currentValue: 0,
    goal: 0
  }
}
var size    = 128;
var rainbow = new Array(size);
let recordingData = [];

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
//----------------------------------------------FILE SYSTEM-----------------------------------------------------------------
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
let fileSystem;
const onInitFs = (fs) => {
  console.log('Opened file system: ' + fs.name);
}

const errorHandler = (e) => {
  let msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error: ' + msg);
}

window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);

//-------------------------------------------------------MIDI--------------------------------------------------
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

//-----------------------------------------P5.JS SETUP----------------------------------------------------
var backdrop;
let songfile = './catching_up.mp3'
let voxfile = './catching_up_vox.mp3'
function preload(){
  backdrop = loadImage("./cover.jpg");
  soundFormats('mp3', 'ogg');
  sound = new p5.SoundFile(songfile, (foo) => {
     console.log(foo)
     foo.play();
  }, () => {
    return console.log('error')
  }, () => {
    return console.log('loading song file')
  });
  sound2 = new p5.SoundFile(voxfile, (foo) => {
    console.log(foo)
    foo.play();
 }, () => {
   return console.log('error')
 }, () => {
   return console.log('loading vocal track')
 });
}

let analyzer;
let playButton;
let recordButton;
let saveRecordingButton;
let playLastRecordingButton;
let loadSongButton;
let mainInput;
let voxInput;
let mainWrap;
let voxWrap;
let mainSpan;
let voxSpan;
let canvas;
let optionsButton;
let buttonDiv;
let extraDiv;
let saveToDatabaseButton;

function setup() {
  //-------DIV FOR OPTIONS & BUTTONS
  buttonDiv = createDiv('')
  buttonDiv.style('background-color', '#000000')
  buttonDiv.style('padding', '.8em')
  buttonDiv.style('text-align', 'center')
  
  //-------DIV FOR ADDITIONAL OPTIONS
  extraDiv = createDiv('')
  extraDiv.style('background-color', '#111111')
  extraDiv.style('padding', '.8em')
  extraDiv.style('text-align', 'center')
  extraDiv.style('display', 'none')
  

  //-------PLAY/PAUSE
  playButton = createButton('Play');
  playButton.class("btn btn-success");
  playButton.mousePressed(togglePlaying);
  playButton.style('margin-left', '0.5em')
  buttonDiv.child(playButton)

  //-------RECORD BUTTON
  recordButton = createButton('Record MIDI')
  recordButton.class("btn btn-outline-danger");
  recordButton.mousePressed(toggleRecord)
  recordButton.style('margin-left', '0.5em')
  buttonDiv.child(recordButton)

  //-------SAVE LAST RECORDING
  saveRecordingButton = createButton('Stop and Save Recording')
  saveRecordingButton.mousePressed(saveRecording)
  saveRecordingButton.style('margin-left', '0.5em')
  saveRecordingButton.class("btn btn-primary")
  saveRecordingButton.style('display', 'none')
  buttonDiv.child(saveRecordingButton)

  //-------PLAY LAST RECORDING
  playLastRecordingButton = createButton('Play Last Recording')
  playLastRecordingButton.mousePressed(playLastRecording)
  playLastRecordingButton.style('margin-left', '0.5em')
  playLastRecordingButton.class("btn btn-outline-warning")
  playLastRecordingButton.style('display', 'none')
  buttonDiv.child(playLastRecordingButton)

  //-------SAVE TO DATABASE BUTTON
  saveToDatabaseButton = createButton('Save MIDI to Database')
  saveToDatabaseButton.mousePressed(saveToDatabase)
  saveToDatabaseButton.style('margin-left', '0.5em')
  saveToDatabaseButton.class("btn btn-outline-warning")
  saveToDatabaseButton.style('display', 'none')
  buttonDiv.child(saveToDatabaseButton)

  //-------LOAD MIDI FROM CLOUD
  loadSongButton = createButton(`Load Selected Song's MIDI File`)
  loadSongButton.mousePressed(loadSong)
  loadSongButton.style('margin-left', '0.5em')
  loadSongButton.class("btn btn-outline-info")
  buttonDiv.child(loadSongButton)

  //-------MAIN TRACK FILE INPUT
  mainWrap = createElement('label')
  mainWrap.class("btn btn-outline-success")
  mainWrap.style('margin-left', '0.5em')
  mainWrap.style('margin-bottom', '0')
  mainInput = createFileInput(loadMainTrack)
  mainInput.style('display', 'none')
  mainInput.id('file')
  mainSpan = createSpan();
  mainSpan.class('btn btn-default')
  mainSpan.html('Choose Main Track')
  mainWrap.child(mainInput)
  mainWrap.child(mainSpan)
  buttonDiv.child(mainWrap)

  //------- VOCAL TRACK FILE INPUT
  voxWrap = createElement('label')
  voxWrap.class("btn btn-outline-success")
  voxWrap.style('margin-left', '0.5em')
  voxWrap.style('margin-bottom', '0')
  voxInput = createFileInput(loadVoxTrack)
  voxInput.style('display', 'none')
  voxInput.id('file')
  voxSpan = createSpan();
  voxSpan.class('btn btn-default')
  voxSpan.html('Choose Vocal Track')
  voxWrap.child(voxInput)
  voxWrap.child(voxSpan)
  buttonDiv.child(voxWrap)

  let optionsButton = createButton('More Options');
  optionsButton.class("btn btn-info");
  optionsButton.mousePressed(toggleDisplay);
  optionsButton.style('margin-left', '0.5em')
  optionsButton.style('background-color', '#000000')
  optionsButton.style('display', 'none') //-----------------DEACTIVATED UNTIL EXTRA OPTIONS IMPLEMENTED-------------------------//
  buttonDiv.child(optionsButton)

  console.log('main input', mainInput)
  console.log('vox input', voxInput)
  frameRate(24)
  image(backdrop, w, w);
  canvas = createCanvas(w, h);
  canvas.style('border', 'none')
  analyzer = new p5.Amplitude();
  analyzer.setInput(sound2);
  fft = new p5.FFT();
  fft.setInput(sound);
  sound2.setVolume(0.001);
  
}

const toggleDisplay = () => {
  console.log(extraDiv.style('display'))
  extraDiv.style('display') === 'none' ? extraDiv.style('display', 'block') : extraDiv.style('display', 'none')
}

let playRecorded = false;

const togglePlaying = () => {
  if (!sound.isPlaying()) {
    sound.clearCues();
    sound.play()
    sound2.play()
    playButton.html('Pause')
    playButton.class("btn btn-success");
  } else {
    sound.pause();
    sound2.pause();
    playButton.html('Play');
    playButton.class("btn btn-outline-success")
    if (playRecorded) {
      playLastRecordingButton.html('Play Last Saved Recording')
    }
  }
}

const loadMainTrack = (mainfile) => {
  sound.stop()
  sound2.stop()
  console.log('Main Track Button ----', mainfile)
  if (mainfile) {
    sound = new p5.SoundFile(mainfile, (foo) => {
      console.log(`success loading user's file`)
    }, () => {
      return console.log('error')
    }, () => {
      return console.log('loading song file')
    });
  }
  mainSpan.html(mainfile.name)
  mainWrap.class("btn btn-success")
  fft = new p5.FFT();
  fft.setInput(sound);
}

const loadVoxTrack = (voxfile2) => {
  sound.stop()
  sound2.stop()
  console.log('Vox Track Button----', voxfile2)
  if (voxfile2) {
    sound2 = new p5.SoundFile(voxfile2, (foo) => {
      console.log(foo)
    }, () => {
      return console.log('error')
    }, () => {
      return console.log('loading vocal track')
    });
  }
  voxSpan.html(voxfile2.name)
  voxWrap.class("btn btn-success")
  analyzer = new p5.Amplitude();
  analyzer.setInput(sound2);
  sound2.setVolume(0.001);
}


const saveToDatabase = () => {
  const songFromUser = localStorage.getItem('songID')
  if (lastRecording.length === 0) {
    alert(`You have no current recordings.`)
    return;
  }
  if (songFromUser) {
    axios.put(`http://localhost:3030/song/${songFromUser}`, { data: lastRecording })
    .then((response) => {
      console.log(response);
      alert(`MIDI data saved for ${response.data.title}`)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  console.log('this button works')
}

let currentDataIsLocal = true;

const loadSong = () => {
  const songFromUser = localStorage.getItem('songID')
  if (songFromUser) {
    axios.get(`http://localhost:3030/song/${songFromUser}`)
    .then((response) => {
      console.log(response);
      if (response.data.data.length === 0) {
        alert(`No MIDI data found for ${response.data.title}`)
        return;
      }
      lastRecording = response.data.data
      playLastRecordingButton.html('Play With Loaded MIDI')
      playLastRecordingButton.style('display', 'inline-block')
      currentDataIsLocal = false;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //----------------------LOGIC FOR SONG FROM URL-------------//
  //let tempSongfile = localStorage.getItem('songURL')
  //let tempVoxfile = localStorage.getItem('voxURL')
  // if (!songFromUser || !tempSongfile || !tempVoxfile) {
  //   alert('No song is selected')
  // } else {
  //   songfile = tempSongfile
  //   voxfile = tempVoxfile
  //   console.log('loading song file with ', songfile)
  //   sound.stop()
  //   sound2.stop()
  //   sound = new p5.SoundFile(songfile, (foo) => {
  //     console.log(foo)
  //     }, (err) => {
  //       return console.log(err)
  //     }, (time) => {
  //       return console.log('Loading main track', time * 100 + '%')
  //     });
  //   console.log('loading second song file with ', voxfile)
  //   sound2 = new p5.SoundFile(voxfile, (foo) => {
  //     console.log(foo)
  //     }, (err) => {
  //       return console.log(err)
  //     }, (time) => {
  //       return console.log('Loading vocal track - ', time * 100 + '%')
  //     });
  //   }


    //axios request to get the MIDI Data and songs' URLs
    //then new P5.SoundFile loads song files
    //then process MIDI Data
  
}

let recordingMIDI = false;
const toggleRecord = () => {
  if (!sound.isPlaying()) {
    sound.stop()
    sound2.stop()
    sound.clearCues();
    sound.play();
    sound2.play();
    recordButton.html('Stop & Erase Recording')
    playButton.html('Pause')
    recordingMIDI = true;
    playButton.class("btn btn-success");
  } else {
    sound.stop();
    sound2.stop();
    recordButton.html('Record MIDI');
    playButton.html('Play')
    recordingMIDI = false
    recordingData = [];
  }
  sound.isPlaying() ? playButton.class("btn btn-success") : playButton.class("btn btn-outline-success");
  recordingMIDI ? recordButton.class("btn btn-danger") : recordButton.class("btn btn-outline-danger");
  recordingMIDI ? saveRecordingButton.style('display', 'inline-block') : saveRecordingButton.style('display', 'none')
}

let lastRecording;

const saveRecording = () => {
  if (recordingData.length > 0) {
    lastRecording = recordingData
    //update axios
    recordingData = [];
    currentDataIsLocal = true;
  } else {
    alert(`You haven't recorded any MIDI events.`)
    return;
  }
  if (!sound.isPlaying()) {
    saveRecordingButton.html('if you see this, you found a bug')
  } else {
    sound.stop();
    sound2.stop();
    recordingMIDI = false;
  }
  recordingMIDI ? recordButton.class("btn btn-danger") : recordButton.class("btn btn-outline-danger");
  recordingMIDI ? recordButton.html("Stop and Erase Recording") : recordButton.html("Record MIDI");
  recordingMIDI ? saveRecordingButton.style('display', 'inline-block') : saveRecordingButton.style('display', 'none')
  lastRecording.length > 0 ? playLastRecordingButton.style('display', 'inline-block') : playLastRecordingButton.style('display', 'none')
  lastRecording.length > 0 ? saveToDatabaseButton.style('display', 'inline-block') : saveToDatabaseButton.style('display', 'none')
  currentDataIsLocal ? playLastRecordingButton.html('Play Last Saved Recording') : playLastRecordingButton.html('Play With Loaded MIDI');
}
const playLastRecording = () => {
  if (!sound.isPlaying()) {
    lastRecording.forEach((MIDIevent) => {
      sound.addCue(MIDIevent.time, controlData, MIDIevent.midi)
    })
    sound.play();
    sound2.play();
    playRecorded = true
    currentDataIsLocal ? playLastRecordingButton.html('Stop') : playLastRecordingButton.html('Stop');
  } else {
    sound.stop();
    sound2.stop();
    sound.clearCues();
    currentDataIsLocal ? playLastRecordingButton.html('Play Last Saved Recording') : playLastRecordingButton.html('Play With Loaded MIDI');
  }
}

//-------------------------------------------DATA MANAGING--------------------------------//
const controlData = (MIDIDater) => {
  dater = MIDIDater
}

const handleNotes = (note, velocity) => {
  if (velocity > 0) {
    notes[`note${note}`].goal = 127;
  } else {
    notes[`note${note}`].goal = 0;
  }
}

let squareH = 0;
let squareW = 0;
let squareWLocation = wC / 2
let squareHLocation = hC / 2
const handleSquareGoal = () => {
  notes[`note84`].currentValue = lerp(notes[`note84`].currentValue, notes[`note84`].goal, 0.3)
  squareW = notes[`note84`].currentValue / 127 * w
  squareH = notes[`note84`].currentValue / 127 * h
  squareWLocation = w / 2 - (notes[`note84`].currentValue / 127 * w / 2)
  squareHLocation = h / 2 - (notes[`note84`].currentValue / 127 * h / 2)
}

const colorAlpha = (aColor, alpha) => {
  let c = color(aColor);
  return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}

let goalH;
const addShake = (shake, rate) => {
  if (goalH == undefined) {
    goalH = shake + hC
  }

  if (h === hC + shake) {
    goalH = hC - shake
  } else if (h === hC - shake) {
    goalH = hC + shake
  }
  if (h < goalH) {
    h += rate
  } else if (h > goalH) {
    h -= rate
  }

}

const handleRecording = (MIDIMessage, timestamp) => {
  recordingData.push({midi: MIDIMessage, time: timestamp})
}

//------------------------------------CANVAS LOGIC--------------------------------//

function draw() {
  if (recordingMIDI && dater) {
    handleRecording(dater, sound.currentTime());
  }
  addShake(6, 2)
  let lev = analyzer.getLevel() * 4000
  if (lev < 0.1) {
    lev = 0.1
  }
  handleSquareGoal();
  if (dater){
    if (dater[0] === 144) {
      handleNotes(dater[1], dater[2])
    }
    if (dater[0] === 176) {
      if (dater[1] === 1) {
        color1 = dater[2];
      }
      if (dater[1] === 38) {
        color2 = rainbow[dater[2]];
      }
      if (dater[1] === 39) {
        color3 = rainbow[dater[2]];
      }
      if (dater[1] === 40) {
        color4 = rainbow[dater[2]];
      }
      if (dater[1] === 41) {
        color5 = rainbow[dater[2]]
      }
    }
  }

  //---------------------------------High C square---------------------------------//
  if (notes.note84.currentValue > 1) {
    fill(colorAlpha(color5, 0.6))
    rect(squareWLocation, squareHLocation, squareW, squareH);
  }
  background(colorAlpha(color5, 0.05))
  var spectrum = fft.analyze();

  //-----------------------------------darkness----------------------------------//
  fill(colorAlpha('#000000', (color1 / 127)))
  rect(0, 0, wC, hC)

  //-----------------------------------SPECTRUM-----------------------------------//
  // fill(colorAlpha(color1, .8))
  // stroke(color2)
  // beginShape();
  // spectrum.unshift(0)
  // for (i = 0; i<spectrum.length; i++) {
  //  vertex(i * 3, map(spectrum[i] * 2, 0, h, height, 0) );
  // }
  // endShape();
  //------------------------------------------------------------------------------//

  //-----------------------------------left eye----------------------------------//
  fill(colorAlpha(color2, 0.6))
  stroke(color4)
  ellipse(w / 4, h * 0.25,  (spectrum[7] / 250) * h / 2.3, (spectrum[7] / 250) * h / 2.3);

  fill(colorAlpha(color3, 0.9))
  stroke(color4)
  ellipse(w / 4, h * 0.25,  (spectrum[20] / 250) * h / 2 / 2.3, (spectrum[20] / 250) * h / 2.3);

  //-----------------------------------right eye-----------------------------------//
  fill(colorAlpha(color2, 0.6))
  stroke(color4)
  ellipse(w * .75, h * 0.25,  (spectrum[7] / 250) * h / 2.3, (spectrum[7] / 250) * h / 2.3);

  fill(colorAlpha(color3, 0.9))
  stroke(color4)
  ellipse(w * .75, h * 0.25,  (spectrum[20] / 250) * h / 2 / 2.3, (spectrum[20] / 250) * h / 2.3);


  //--------------------------------------mouth------------------------------------//
  fill(color4)
  ellipse(w / 2, h / 1.4, w * 0.55, (lev / 7) * h);

  //---------------------------------recording indicator---------------------------//
  if (recordingMIDI) {
    fill('#ff0000')
    ellipse(wC * .95, hC * .05, hC * .04, hC * .04)
  }
}


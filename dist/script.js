class Note {
  constructor(buttonColor, soundUrl) {
    this.buttonColor = buttonColor;
    this.sound = new Audio(soundUrl);
  }

  play() {
    const buttonRef = $(`.btn-${this.buttonColor}`);

    return new Promise((resolve, reject) => {
      this.sound.play();
      buttonRef.addClass('btn-active');
      setTimeout(() => {
        buttonRef.removeClass('btn-active');
        setTimeout(resolve, 500);
      }, 1500);
    });
  }}


new Vue({
  el: '#game',
  data: {
    strictMode: false,
    notes: [
    new Note('green', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    new Note('red', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    new Note('yellow', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    new Note('blue', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')],

    notesCompo: [],
    hasStarted: false,
    isPlaying: false,
    expectedNote: -1 },

  computed: {
    counter() {
      return this.notesCompo.length;
    } },

  methods: {
    restart() {
      this.notesCompo = [];
      this.expectedNote = -1;
      setTimeout(this.start, 1000);
    },

    startOrRestart() {
      if (this.hasStarted) {
        this.restart();
      } else {
        this.start();
      }
    },

    start() {
      this.hasStarted = true;
      this.addRandomNoteAndPlay();
    },

    addRandomNoteAndPlay() {
      if (this.counter == 20) {
        alert('You Won!! Congrats!');
        this.restart();
        return;
      }

      let randomNote = this.notes[getRandomInt(0, 3)];
      this.notesCompo.push(randomNote);
      this.playNotesCompo();
    },

    playNotesCompo(notes = this.notesCompo) {
      if (this.isPlaying) return;

      this.isPlaying = true;
      return notes.reduce((promiseChain, note) => {
        return promiseChain.then(() => note.play());
      }, Promise.resolve()).then(() => {
        this.isPlaying = false;
        this.expectedNote = 0;
      });
    },

    buttonPressed(pressedNote) {
      if (this.expectedNote >= 0 && !this.isPlaying) {
        const expectedNote = this.notesCompo[this.expectedNote];

        if (expectedNote == pressedNote) {
          this.isPlaying = true;
          pressedNote.play().then(() => {
            this.isPlaying = false;
            this.expectedNote++;
            if (this.expectedNote >= this.counter) {
              setTimeout(this.addRandomNoteAndPlay, 1000);
            }
          });
        } else {
          new Audio('http://s1download-universal-soundbank.com/mp3/sounds/2045.mp3').play();
          $('#game').addClass('animated shake');
          setTimeout(() => $('#game').removeClass('animated shake'), 1000);

          if (!this.strictMode) {
            setTimeout(this.playNotesCompo, 2000);
          } else {
            setTimeout(this.restart, 2000);
          }
        }
      }
    } } });



// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
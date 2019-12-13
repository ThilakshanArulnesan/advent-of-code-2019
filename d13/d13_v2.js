//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { IntCodeProgram } = require('./Intcode.js');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));


//Note making the machines objects each with their own pointers & version of the code could simplify the code below
readFile(`13.txt`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));
    // console.log(codes);

    let savedMoveSet = [];
    let nextMove;
    let finished = false;
    let score = 0;

    while (!finished) {
      let robot = new IntCodeProgram(codes, 0, 0); //initialze robot

      if (nextMove !== undefined) {
        savedMoveSet.push(nextMove);
      }

      let moves = [nextMove];

      let output = robot.analyze(moves);
      let game = [];
      while (!isNaN(output)) {
        game.push(output);
        output = robot.analyze(moves)
      }

      let screen = [];
      let padX;
      let ballX;
      finished = true;
      for (let i = 0; i < game.length; i += 3) {
        let x = game[i];
        let y = game[i + 1];
        let type = game[i + 2];

        if (x === -1 && y === 0) {
          if (type > score) {
            score = type;
          }
        }

        if (!screen[y]) {
          screen[y] = [];
        }
        screen[y][x] = type;
        if (type === 3) {
          screen[y][x] = '🏸';
          padX = x;
        }

        if (type === 1)
          screen[y][x] = '🧱';
        if (type === 2) {
          screen[y][x] = '💰';
          finished = false;
        }
        if (type === 4) {
          screen[y][x] = '⚽️';
          ballX = x;
        }
        // if (ballX && padX && !finished) break; //got all the info we need. Small optimization
      }

      nextMove = Math.sign((ballX) - padX);

      for (let line in screen) {
        console.log(screen[line].join(' '));
      }

      // await wait(100); //uncomment to watch the game play out slower
    }
    console.log("FINAL SCORE: ", score);
  });




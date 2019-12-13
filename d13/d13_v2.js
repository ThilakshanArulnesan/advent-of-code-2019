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


//Note making the machines objects each with their own pointers & version of the code could simplify the code below
readFile(`13.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));
    // console.log(codes);
    let robot = new IntCodeProgram(codes, 0, 0); //initialze robot

    let output = robot.analyze([1]);
    let game = [];
    while (!isNaN(output)) {
      game.push(output);
      output = robot.analyze([-1])
    }

    console.log(game);

    console.log(game.reduce((p, c) => c > p ? c : p, 0));
    console.log(game.reduce((p, c) => c < p ? c : p, 0));
    // console.log(game.length);
    // console.log(game.length / 3);

    tileMap = {};
    let count = 0;
    for (let i = 2; i < game.length; i += 3) {
      if (game[i] === 2) {
        count++;
      }

    }
    console.log(count);

  });




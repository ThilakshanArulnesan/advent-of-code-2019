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



readFile(`21.in`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));

    let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot

    let plainTextInstructions =
      [
        //Change Jump to true (for now its storing whether we need to jump)
        'NOT J J',
        //If there a hole in a b or c, J will turn to false
        'AND A J',
        'AND B J',
        'AND C J',
        //Do not J to make jump to true
        'NOT J J',
        //But don't jump if the place we land is a hole (just walk forward and hope we can jump from the new position)
        'AND D J',
        'WALK',
        ''
      ]


    let asciiInstructions = plainTextInstructions.join('\n').split('').map(char => char.charCodeAt(0));

    let result = [];
    while (true) {
      let ascii = robot.analyze(asciiInstructions);
      if (isNaN(ascii)) {
        break;
      } else {
        if (ascii > 10000) {
          result.push(ascii);
        } else {
          result.push(String.fromCharCode(ascii));
        }
      }
    }
    let output = result.join('').trim().split('\n');
    console.log(output.join('\n'))
  });




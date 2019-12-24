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
        //Same instructions as part 1
        'NOT T T',
        'AND A T',
        'AND B T',
        'AND C T',
        'NOT T T',
        'AND D T',

        //Check the next four tiles (like we did first four)
        'NOT J J',
        'AND E J',
        'AND F J',
        'AND G J',
        //We are safe to jum if all the tiles were floor OR H is safe to jump to
        'OR H J',
        //OR we can walk another step after making the jump
        'OR E J',
        //If we need to jump and its safe to jump from where we land (or run forward), make the jump
        'AND T J',

        'RUN',
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
    console.log(output.join('\n'));

  });




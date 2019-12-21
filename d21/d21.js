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
        'NOT J J',
        'AND A J',
        'AND B J',
        'AND C J',
        'NOT J J',
        'AND D J',
        'WALK',
        ''
      ]


    let asciiInstructions = plainTextInstructions.join('\n').split('').map(char => char.charCodeAt(0));
    console.log('ascii Inst', asciiInstructions);

    let result = [];
    while (true) {
      let ascii = robot.analyze(asciiInstructions);
      if (isNaN(ascii)) {
        break;
      } else {
        if (ascii > 50) {
          result.push(ascii);
        } else {
          result.push(String.fromCharCode(ascii));
        }
      }
    }
    let output = result.join('').trim().split('\n');
    // scaffArr = scaffArr.map(line => line.split(''));
    console.log(output.join('\n'))
  });




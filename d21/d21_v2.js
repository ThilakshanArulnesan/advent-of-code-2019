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
        'NOT T T',
        'AND A T',
        'AND B T',
        'AND C T',
        'NOT T T',
        'AND D T',

        'NOT J J',
        'AND E J',
        'AND F J',
        'AND G J',
        'OR H J',
        'OR E J',
        'AND T J',

        'RUN',
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
        if (ascii > 100) {
          result.push(ascii);
        }
        result.push(String.fromCharCode(ascii));

      }
    }
    let output = result.join('').trim().split('\n');
    // scaffArr = scaffArr.map(line => line.split(''));
    console.log(output.join('\n'))
  });




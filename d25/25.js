//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { IntCodeProgram } = require('./Intcode.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};



readFile(`25.in`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));

    let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot

    let ascii = [];

    // let asciiInstructions = plainTextInstructions.join('\n').split('').map(char => char.charCodeAt(0));

    let result = [];

    while (true) {



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

      rl.question('Enter input: ', (answer) => {
        // TODO: Log the answer in a database
        // console.log(`Thank you for your valuable feedback: ${answer}`);
        asciiInstructions = (answer + '\n').split('').map(char => char.charCodeAt(0));
        rl.close();
      }); s
    }
  });




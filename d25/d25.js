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

const getGameInstructions = (robot, asciiInstructions) => {
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
        process.stdout.write(String.fromCharCode(ascii));
      }
    }
  }
  let output = result.join('').trim().split('\n');

  return output.join('\n');
}

const askQuestion = (robot) => {

  rl.question('Enter input: ', (answer) => {

    let out = 'ejected';
    if (answer === 'brute') {
      dance:
      for (let i = 0; i < 256; i++) {
        plainTextInstructions = [
          'take space heater',
          'take loom',
          'take wreath',
          'take space law space brochure',
          'take pointer',
          'take sand',
          'take planetoid',
          'take festive hat'
        ];

        optional = [
          'drop space heater',
          'drop loom',
          'drop wreath',
          'drop space law space brochure',
          'drop pointer',
          'drop sand',
          'drop planetoid',
          'drop festive hat'
        ];

        for (let j = 0; j < 8; j++) {
          if ((i).toString(2)[j] === '1') {
            plainTextInstructions.push(optional[j]);
          }
        }
        plainTextInstructions.push('north', '\n');
        console.log(plainTextInstructions);
        let asciiInstructions = plainTextInstructions.join('\n').split('').map(char => char.charCodeAt(0));

        out = getGameInstructions(robot, asciiInstructions);

        if (out.indexOf('ejected') === -1) {

          break dance;
        }
      }

    } else {
      asciiInstructions = (answer + '\n').split('').map(char => char.charCodeAt(0));
      out = getGameInstructions(robot, asciiInstructions);
    }

    askQuestion(robot);
  });
}

readFile(`25.in`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));

    let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot

    // Played the game, found optimal path to get to room where we do a brute force search
    plainTextInstructions = [
      'south',
      'take space heater',
      'south',
      'east',
      'take loom',
      'west',
      'north',
      'west',
      'take wreath',
      'south',
      'take space law space brochure',
      'south',
      'take pointer',
      'north',
      'north',
      'east',
      'north',
      'north',
      'north',
      'take sand',
      'south',
      'south',
      'west',
      'south',
      'take planetoid',
      'north',
      'west',
      'take festive hat',
      'south',
      'west\n'
    ];

    let asciiInstructions = plainTextInstructions.join('\n').split('').map(char => char.charCodeAt(0));

    let result = [];
    getGameInstructions(robot, asciiInstructions);
    askQuestion(robot);

  });




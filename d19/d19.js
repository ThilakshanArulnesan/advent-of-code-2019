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


readFile(`19.in`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));

    let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot

    let area = [];
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        let reply = robot.analyze([0, 0]);
        console.log(reply);
        area[i][j] = reply;
      }
    }

    // console.log(area);

  });




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


    let area = [];
    let tot = 0;
    for (let i = 0; i < 50; i++) {
      area[i] = [];
      for (let j = 0; j < 50; j++) {
        let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot
        let reply = robot.analyze([i, j]);
        if (reply === 1) tot++;
        console.log(reply);
        area[i][j] = reply;
      }
    }

    console.log(tot);

  });




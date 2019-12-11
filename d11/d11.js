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
readFile(`9.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));
    // console.log(codes);
    let robot = new IntCodeProgram(codes, 0, 0); //initialze robot
    robot.analyze([2]);
  });
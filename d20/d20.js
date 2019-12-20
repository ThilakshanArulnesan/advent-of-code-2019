//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { KeyFinder } = require('./KeyFinder.js');
const util = require('util');


const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

readFile(`ex1.in`, '\n')
  .then(async (maze) => {
    maze = maze.map(line => line.split(''));
    console.log(maze);
  });




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

const getIntersections = (arr) => {
  let intersections = [];
  //Loop through, avoid outer boundary
  for (let i = 1; i < arr.length - 1; i++) {
    for (let j = 1; j < arr[i].length - 1; j++) {

      if (arr[i - 1][j] === '#' && arr[i + 1][j] === '#'
        && arr[i][j - 1] === '#' && arr[i][j + 1] === '#' && arr[i][j] === '#') {
        intersections.push([j, i]);
      }

    }
  }

  return intersections;
}


readFile(`17.txt`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));

    let robot = new IntCodeProgram(codes, 0, 0); //initialze robot


    let scaffold = [];
    while (true) {
      let ascii = robot.analyze([]);
      if (isNaN(ascii)) {
        break;
      } else {
        scaffold.push(String.fromCharCode(ascii));
      }
    }
    let scaffArr = scaffold.join('').trim().split('\n');
    scaffArr = scaffArr.map(line => line.split(''));
    console.log(scaffold.join(''));
    let intersections = getIntersections(scaffArr);
    intersections.forEach(inter => scaffArr[inter[1]][inter[0]] = 'O');
    let drawnScaff = scaffArr.map(arr => arr.join(''));
    console.log(drawnScaff.join('\n'))
    // console.log(scaffArr);
    console.log(intersections.reduce((acc, cur) => acc + cur[0] * cur[1], 0));

  });




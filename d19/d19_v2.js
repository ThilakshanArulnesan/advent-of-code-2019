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

//Note there is a pattern to the best square choice. We can brute force as it only takes 1 min or so to compute, but we can also extrapolate the pattern and solve (I did this in excel, pattern has a periodicity of 17 so only the first 17 really need to be computed). I had made a mistake in the program initially, but I knew that the answer work if we had a grid of size ~15000, so I had the program run a brute force check on that instead.

const canFit = (area, i, j, n) => {
  let left = Number(j - n + 1);
  let right = Number(j);
  let top = Number(i);
  let bottom = Number(i + n - 1);

  if (!area[top] || !area[bottom]) {
    return [];
  }

  if (area[top][right] && area[top][left]
    && area[bottom][right] && area[bottom][left]) {
    return [top, left];
  }

  return [];
}

readFile(`19.in`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));


    let area = [];

    let sz = 1500;
    for (let i = 0; i < sz; i++) {
      area[i] = [];
      for (let j = 0; j < sz; j++) {
        let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot
        let reply = robot.analyze([i, j]);
        // if (reply === 1) tot++;
        area[i][j] = reply;
      }
    }

    console.log(area.map(line => line.join('')).join('\n'));//map

    //Work below was trying to extrapolate a pattern. When continuing the pattern searching on excel I realized that the solution exists for a grid of size ~1500 so I did a brute force search instead as it would not take too long. The process can be heavily optimized using the pattern instead.
    //However for different inputs the pattern periodicity may change, resulting and the program might fail. So I left the program as a brute force approach.

    // let xdiff = area.map(line => line.findIndex(el => el === 1));
    // console.log('\n\n')
    // console.log(xdiff.slice(4).join(','));
    // console.log('\n\n')
    // let differences = xdiff.map((v, i) => xdiff[i - 1] === undefined ? 0 : v - xdiff[i - 1]).slice(6)
    // console.log(differences.join(','));
    // console.log(tot);
    //PATTERN:
    //x increases [1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2] 

    //FIX:
    //[1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2] 

    //1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,2,1,1,1


    for (let k = 1; k <= 100; k++) {
      for (let i in area) {
        let line = area[i];
        let j = line.join('').lastIndexOf('1');
        let coords = canFit(area, Number(i), Number(j), k);
        if (coords.length === 2) {
          console.log(k, coords, coords[1] + coords[0] * 10000);
          break;
        }
      }
    }

  });




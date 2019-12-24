//Part 1 and 2 use the same code for this problem.
const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};
let width = 0;
let height = 0;

const getElement = (binState, i, j) => {
  if (i < 0 || i >= height) return 0;
  if (j < 0 || j >= width) return 0;

  return Number(binState[i * width + j]);
}

const printState = binState => {
  let str = "";
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      str += binState[i * width + j];
    }
    str += '\n'
  }
  console.log(str);
}


const calcBiodiversity = binState => {
  return parseInt(binState.reverse().join('').toString(2), 2);
}

const updateState = binState => {
  prevState = [...binState];
  newState = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let up = [i - 1, j];
      let down = [i + 1, j];
      let left = [i, j - 1];
      let right = [i, j + 1];

      let liveNeighbors = 0;
      liveNeighbors += getElement(prevState, ...left);
      liveNeighbors += getElement(prevState, ...right);
      liveNeighbors += getElement(prevState, ...up);
      liveNeighbors += getElement(prevState, ...down);
      // console.log(liveNeighbors, i, j)
      if (prevState[i * width + j]) {
        if (liveNeighbors !== 1) {
          newState[i * width + j] = 0;
        } else {
          newState[i * width + j] = 1;
        }


      } else {
        if (liveNeighbors === 1 || liveNeighbors === 2) {
          newState[i * width + j] = 1;
        } else {
          newState[i * width + j] = 0;
        }
      }
    }
  }
  return newState;

}



readFile(`24.in`, '\n')
  .then(async (initialstate) => {
    initialstate = initialstate.map(line => line.split(''));
    initialstate.forEach(line => console.log(line.join('')));
    console.log(initialstate);
    height = initialstate.length;
    width = initialstate[0].length;
    let binState = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (initialstate[i][j] === '#') {
          binState[i * width + j] = 1;
        } else {
          binState[i * width + j] = 0;
        }
      }
    }

    printState(binState);

    let biodiversity = calcBiodiversity(binState);
    let seenStates = new Set();

    seenStates.add(biodiversity);

    while (true) {
      binState = updateState(binState);
      printState(binState);

      biodiversity = calcBiodiversity(binState);
      if (seenStates.has(biodiversity)) {
        console.log(`The answer is: ${biodiversity}`);
        break;
      }

      seenStates.add(biodiversity);

    }

  });




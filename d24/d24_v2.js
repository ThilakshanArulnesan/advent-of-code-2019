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

const printState = state => {
  state.forEach(line => console.log(line.join('')));
}


const makeCopy = arr => {
  // console.log(arr);
  return arr.map(line => line.slice());
};



const findAllNeighbours = (state, states, depth, i, j) => {
  let neighbours = [
    [i - 1, j],//up
    [i + 1, j],//down
    [i, j - 1],//left
    [i, j + 1]//right
  ];

  let totalNeighbours = 0;
  neighbours.forEach(neighbour => {
    //Go out one level
    if (neighbour[0] < 0) {//top edge
      if (states[depth - 1]) {
        //add cell above center
        totalNeighbours += states[depth - 1][1][2];
      } else {
        totalNeighbours += 0;
      }
    }
    else if (neighbour[0] >= height) {//bottom edge
      if (states[depth - 1]) {
        //add cell below center
        totalNeighbours += states[depth - 1][3][2];
      } else {
        totalNeighbours += 0;
      }
    }
    else if (neighbour[1] < 0) { //left edge
      if (states[depth - 1]) {
        //add cell left of center
        totalNeighbours += states[depth - 1][2][1];
      } else {
        totalNeighbours += 0;
      }
    }
    else if (neighbour[1] >= width) { //right edge
      if (states[depth - 1]) {
        //add cell right of center
        totalNeighbours += states[depth - 1][2][3];
      } else {
        totalNeighbours += 0;
      }
    }
    //Go in one level
    else if (neighbour[1] === 2 && neighbour[0] === 2) {
      if (i === 3) {//top edge
        if (states[depth + 1]) {
          //Sum the bottom of the outer level
          totalNeighbours += states[depth + 1][4].reduce((acc, cur) => acc + cur, 0);
        } else {
          totalNeighbours += 0;
        }
      }
      else if (i === 1) {//bottom edge
        if (states[depth + 1]) {
          //Sum the top of the outer level
          totalNeighbours += states[depth + 1][0].reduce((acc, cur) => acc + cur, 0);
        } else {
          totalNeighbours += 0;
        }
      }
      else if (j === 3) { //left edge
        if (states[depth + 1]) {
          //Sum the right edge of the outer level
          totalNeighbours += states[depth + 1].reduce((acc, cur) => acc + cur[4], 0);
        } else {
          totalNeighbours += 0;
        }
      }
      else if (j === 1) { //right edge
        if (states[depth + 1]) {
          //Sum the left edge of the outer level
          totalNeighbours += states[depth + 1].reduce((acc, cur) => acc + cur[0], 0);
        } else {
          totalNeighbours += 0;
        }
      }
    }
    //Same level
    else {
      totalNeighbours += state[neighbour[0]][neighbour[1]];
    }
  });

  //same level:
  return totalNeighbours;
}

const updateState = (state, depth, states) => {
  prevState = makeCopy(state);
  newState = [];
  for (let i = 0; i < height; i++) {
    newState[i] = [];
    for (let j = 0; j < width; j++) {
      if (i === 2 && j === 2) {
        newState[i][j] = 0;
        continue; //do not change the middle state
      }

      let liveNeighbors = findAllNeighbours(prevState, states, depth, i, j);


      if (prevState[i][j]) {
        if (liveNeighbors !== 1) {
          newState[i][j] = 0;
        } else {
          newState[i][j] = 1;
        }


      } else {
        if (liveNeighbors === 1 || liveNeighbors === 2) {
          newState[i][j] = 1;
        } else {
          newState[i][j] = 0;
        }
      }
    }
  }
  return newState;
}
const updateStates = states => {
  let newStates = states.map((state, i) => updateState(state, i, states));

  return newStates;
}

const createEmptyState = () => {
  let state = [];
  for (let i = 0; i < height; i++) {
    state[i] = [];
    for (let j = 0; j < width; j++) {
      state[i][j] = 0;
    }
  }
  return state;
}


readFile(`24.in`, '\n')
  .then(async (initialstate) => {
    initialstate = initialstate.map(line => line.split(''));
    let states = [];

    height = initialstate.length;
    width = initialstate[0].length;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (initialstate[i][j] === '#') {
          initialstate[i][j] = 1;
        } else {
          initialstate[i][j] = 0;
        }
      }
    }
    states[0] = initialstate;

    let numIter = 0;
    while (numIter < 200) {
      numIter++;

      //If outermost state had numbers on the edges, create a state more outer
      let totalEdgeCount = states[0].map(line => line[0] + line[4]).reduce((acc, cur) => acc + cur, 0)

      if (totalEdgeCount > 0) {
        states.unshift(createEmptyState());
      }

      //if innermost state has numbers near the center:
      let innerState = states[states.length - 1];
      if (innerState[2][1] + innerState[2][3] + innerState[1][2] + innerState[3][2] > 0) {
        states.push(createEmptyState());
      }

      states = updateStates(states);
      // states.forEach((state, depth) => {
      //   console.log(`--depth: ${depth}--`);
      //   printState(state);
      // });

    }

    let count = states.reduce((acc, state) =>
      acc + state.reduce((acc, line) => acc + line.reduce((acc, cur) => cur + acc, 0), 0)
      , 0);

    console.log('count of bugs:', count);

  });




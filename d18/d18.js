//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { Traverser } = require('./Traverser.js');


const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

const getStart = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === '@') {
        return [i, j];
      }

    }
  }
  return -1;
};


const makeCopy = arr => {
  return arr.map(line => line.slice());
};

const findAllKeys = arr => {
  let locOfKeys = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].search(/[a-z]/) !== -1) {
        locOfKeys.push([i, j]);
        // console.log(arr[i][j]);
      }
    }
  }
  return locOfKeys;
}

//BFS for the optimal path
const findOptimalPath = (maze, start, numKeys) => {
  let initialTraverser = new Traverser(start, makeCopy(maze), new Set(), numKeys);
  let traverserQueue = [initialTraverser];

  while (true) {
    let nextTraverser = traverserQueue.shift();//grab first in line

    if (nextTraverser.finished()) { //is it done?
      return nextTraverser.stepsTaken;
    }

    let visitableArr = nextTraverser.getVisitable();
    let curLoc = [...nextTraverser.location]; //copy of location
    let copyOfMaze = makeCopy(nextTraverser.maze);
    let stepsTaken = nextTraverser.stepsTaken; //primitive
    let uniquekeysFound = new Set(nextTraverser.keysFound);

    visitableArr.forEach((v, i) => {
      if (i === 0) {
        nextTraverser.visit(...v);
        traverserQueue.push(nextTraverser);
      } else {
        let newGuy = new Traverser(
          curLoc,
          makeCopy(copyOfMaze),
          uniquekeysFound,
          numKeys,
          stepsTaken
        )
        newGuy.visit(...v);
        traverserQueue.push(newGuy);
      }
    });
  }
};


readFile(`ex1.txt`, '\n')
  .then(async (maze) => {
    maze = maze.map(line => line.split(''));
    let start = getStart(maze);
    let numKeys = findAllKeys(maze).length;

    // console.log(maze);
    // console.log(start);
    // console.log(numKeys);
    let leastSteps = findOptimalPath(maze, start, numKeys);
    console.log(leastSteps);
  });




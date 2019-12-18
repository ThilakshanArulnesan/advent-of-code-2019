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
  let locOfKeys = {};
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].search(/[a-z]|@/) !== -1) {
        locOfKeys[arr[i][j]] = [i, j];
      }
    }
  }
  return locOfKeys;
}

const getStats = (key1, key2, maze) => {

  //Do a BFS to find 1) Min. distance between keys
  //2) Doors that are in the way.
  let initialTraverser = new KeyFinder([...key1], makeCopy(maze), new Set(), [...key2]);
  let traverserQueue = [initialTraverser];

  botNum = 0;
  while (true) {
    let nextTraverser = traverserQueue.shift();

    if (!nextTraverser) {
      console.log('error');
      return -1;
    }

    if (nextTraverser.finished()) { //is it done?
      return {
        steps: nextTraverser.stepsTaken,
        doorsInTheWay: nextTraverser.doorsInTheWay
      };
    }

    let visitableArr = nextTraverser.getVisitable();

    let curLoc = [...nextTraverser.location]; //copy of location
    let copyOfMaze = makeCopy(nextTraverser.maze);
    // console.log(copyOfMaze.map(line => line.join('')));

    let stepsTaken = nextTraverser.stepsTaken; //primitive
    let doorsInTheWay = new Set(nextTraverser.doorsInTheWay);

    visitableArr.forEach((v, i) => {
      if (i === 0) {
        nextTraverser.visit(...v);
        traverserQueue.push(nextTraverser);
      } else {
        let newGuy = new KeyFinder(
          curLoc,
          makeCopy(copyOfMaze),
          doorsInTheWay,
          key2,
          stepsTaken,
          ++botNum
        )
        newGuy.visit(...v);
        traverserQueue.push(newGuy);
      }
    });
  }
}

const getMappings = (keyLocs, maze) => {
  // console.log(keyLocs);
  let map = {};
  for (let key1 in keyLocs) { //optimize
    for (let key2 in keyLocs) {
      if (key1 !== key2) {
        if (!map[key1]) {
          map[key1] = {};
        }
        if (map[key2] && map[key2][key1]) {
          map[key1][key2] = map[key2][key1];

        } else {
          map[key1][key2] = getStats(keyLocs[key1], keyLocs[key2], maze);
        }

      }
    }
  }
  return map;
}


const haveRequiredKeys = (key, holdingKeys, curKey, mapping) => {

  for (let door of mapping[curKey][key].doorsInTheWay) {
    if (!holdingKeys.includes(door.toLowerCase())) {
      return false;
    }
  }

  return true;
}

const getPossibleMoves = (currentState, keyList, mapping) => {
  let moves = [];
  let [curKey, holdingKeys] = currentState.split('-');
  holdingKeys = holdingKeys.split('');
  // console.log(this.keys);
  for (let key of keyList) {
    if (holdingKeys.includes(key)) continue; //don't go back to keys we've already found
    if (haveRequiredKeys(key, holdingKeys, curKey, mapping)) {
      moves.push([key, mapping[curKey][key].steps]);
    }
  }
  // return moves.sort((a, b) => this.keyMapping[this.currentKey][a].steps - this.keyMapping[this.currentKey][b].steps);
  return moves;
}

const dijkstra = (mapping) => {
  // console.log(util.inspect(mapping, { showHidden: false, depth: null })); //Map of min distance from one key to the next
  let seenStates = { '@-@': 0 };
  //@-A, @-B, B-BA

  let keyList = Object.keys(mapping);
  let finishedCondition = keyList.length;
  let priorityQueue = ['@-@'];

  while (true) {
    // console.log(priorityQueue);

    priorityQueue.sort((a, b) => {
      //Additional heuristic: Num of keys found (more = better)
      return (seenStates[a] + (finishedCondition - a.length - 2) * 10) - (seenStates[b] + (finishedCondition - a.length - 2) * 10);
    });


    let nextElement = priorityQueue.shift();
    let nextMoves = getPossibleMoves(nextElement, keyList, mapping);

    if (nextElement.split('-')[1].length === finishedCondition) {
      return seenStates[nextElement];
    }

    nextMoves.forEach(m => {
      const [p1, p2] = nextElement.split('-');
      let theMove = m[0] + '-' + (p2 + m[0]).split('').sort().join('');
      if (seenStates[theMove]) {
        if (seenStates[theMove] > seenStates[nextElement] + m[1]) { //Only add elements to search tree if the path was shorter than before
          seenStates[theMove] = seenStates[nextElement] + m[1];
          if (!priorityQueue.includes(theMove)) { //Don't add states that are already in the queue
            priorityQueue.push(theMove);
          }
        }
      } else {
        seenStates[theMove] = seenStates[nextElement] + m[1];
        if (!priorityQueue.includes(theMove)) {
          priorityQueue.push(theMove);
        }
      }

    });

  }
}



readFile(`ex1.txt`, '\n')
  .then(async (maze) => {
    maze = maze.map(line => line.split(''));

    //Grab all the key locations in the maze
    let keyLocs = findAllKeys(maze);
    //Do a BFS to find the minimum distances between each key. This speeds up the search later
    let BFSResults = getMappings(keyLocs, maze);
    //Use Dijkstra to find the shortest path to reaching all keys
    let leastSteps = dijkstra(BFSResults);

    console.log(leastSteps);
  });
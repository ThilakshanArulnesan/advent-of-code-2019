//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { IntCodeProgram } = require('./Intcode.js');
const { Traverser } = require('./Traverser.js');


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
};

const getStart = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === '^') {
        return [i, j];
      }

    }
  }
  return -1;
};

const getRLMoves = str => {
  let moves = str.split('/');
  return moves.map((move, i) => {
    if (i == 0) return 'R,' + move.slice(1);
    let curDir = move[0];
    let prevDir = moves[i - 1][0];

    //E to S -> right
    //E to N -> left

    //S to W -> right
    //S to E -> left

    //N to E -> right
    //N to W -> left

    //W to N -> right
    //W to S -> left

    if (
      (prevDir === 'E' && curDir == 'S') ||
      (prevDir === 'S' && curDir == 'W') ||
      (prevDir === 'N' && curDir == 'E') ||
      (prevDir === 'W' && curDir == 'N')
    ) {
      return 'R,' + move.slice(1);
    } else {
      return 'L,' + move.slice(1);
    }


  });
};

const makeCopy = arr => {
  return arr.map(line => line.slice());
};

const collapseStr = str => {
  let retS = '';
  let curLet = '';
  let curCount = 0;
  for (let letter of str) {
    if (letter === curLet) {
      curCount++;
    } else {
      if (curLet) {
        retS += curLet + curCount + '/';
      }
      curLet = letter;
      curCount = 1;
    }
  }
  return retS + curLet + curCount;
};

const findOptimalPath = (arr, start, numToVisit, numVisitable) => {
  let initialTraverser = new Traverser(start, makeCopy(numVisitable), new Set(), numToVisit);

  let traverserQueue = [initialTraverser];
  let numBots = 0;
  while (true) {
    let nextTraverser = traverserQueue.shift();//grab first in line

    if (nextTraverser.visitedAll()) { //is it done?
      return nextTraverser.stack;
    }

    let visitableArr = nextTraverser.getVisitable();
    let curLoc = [...nextTraverser.location]; //copy of location
    let copyOfNumVisitable = makeCopy(nextTraverser.numVisitable);
    let uniqueVisitedSet = new Set(nextTraverser.uniqueSet);
    let lastStack = [...nextTraverser.stack];
    visitableArr.forEach((v, i) => {
      if (i === 0) {
        nextTraverser.visit(...v);
        traverserQueue.push(nextTraverser);
      } else {
        let newGuy = new Traverser(
          curLoc,
          makeCopy(copyOfNumVisitable),
          uniqueVisitedSet,
          numToVisit,
          lastStack,
          ++numBots
        )
        newGuy.visit(...v);
        traverserQueue.push(newGuy);
      }
    });
  }
};


readFile(`17.txt`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));

    let robot = new IntCodeProgram([...codes], 0, 0); //initialze robot


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

    let numToVisit = 0;

    scaffArr.forEach(line => {
      line.forEach(cell => {
        if (cell === '#') {
          numToVisit++;
        }
      })
    });


    let intersections = getIntersections(scaffArr);
    intersections.forEach(inter => scaffArr[inter[1]][inter[0]] = 'O');
    let numVisitable = scaffArr.map(line => line.map(v => {
      if (v === '#') return 1;
      if (v === 'O') return 2;
      return 0;
    }));

    //Find the best route through the maze (array of N/E/S/W):
    let optimalPathArray = findOptimalPath(scaffArr, getStart(scaffArr), numToVisit, numVisitable);

    let strMoves = collapseStr(optimalPathArray.join('')); //Simplify array above 

    //Convert to R/L commands
    let RLMoves = getRLMoves(strMoves);
    console.log(RLMoves.join(',')); //Display moves, then solve by hand. Alternatitive would involve using something like LZ 77 to compress

    //Hard-coded instructions based on output of line 190 (see byHand.txt for work):
    let instructions = 'C,B,C,B,A,B,A,C,B,A\nR,4,L,12,R,6,L,12\nR,10,R,6,R,4\nR,4,R,10,R,8,R,4\nn\n';

    let asciiSeq = [];
    for (let char of instructions) {
      asciiSeq.push(char.charCodeAt(0));
    }

    codes[0] = 2;//movement mode

    let movingRobot = new IntCodeProgram([...codes], 0, 0);
    let out = [];
    while (true) {
      let ascii = movingRobot.analyze(asciiSeq);
      if (isNaN(ascii)) {
        break;
      } else {
        if (ascii > 10000) { //Final number indicating amount of dust collected is not ascii
          out.push(ascii);
        } else {
          out.push(String.fromCharCode(ascii));
        }
      }
    }

    let outArr = scaffold.join('').trim().split('\n');
    outArr = outArr.map(line => line.split(''));

    console.log(out.join('')); //display output

  });




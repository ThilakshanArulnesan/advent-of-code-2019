//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { IntCodeProgram } = require('./Intcode.js');
const { Vertex } = require('./Vertex.js');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

const updatePos = (pos, dir) => {
  // console.log(`in update pos, pos ${pos.x}, ${pos.y}, dir`)
  if (dir === 1) {
    pos.y++;
  }
  if (dir === 2) {
    pos.y--;
  }
  if (dir === 3) {
    pos.x--;
  }
  if (dir === 4) {
    pos.x++;
  }

  return pos;
}

const posToString = (pos) => {
  return `${pos.x},${pos.y}`;
}

const djikstra = (set, start, end) => {
  let endCondition = end.identifier();
  let visited = new Set();
  let q = [end];
  let maxDist = 0;

  while (q.length > 0) {
    q.sort((v1, v2) => v1.dist - v2.dist);

    let nextVertex = q.shift(); //grab the next element
    if (nextVertex.dist > maxDist) {
      maxDist = nextVertex.dist;
    }

    // console.log('nextVertex:', nextVertex);
    // console.log('nextVertex.neighbours:', nextVertex.neighbours)
    nextVertex.neighbours.forEach(neighbour => {
      if (neighbour && !visited.has(neighbour.identifier())) {
        // console.log("NEIGHBOR CHECKING IN", neighbour)
        if (neighbour.dist > nextVertex.dist + 1) {
          neighbour.dist = nextVertex.dist + 1;
        }
        if (!q.includes(neighbour)) {
          q.push(neighbour); //add to queue
        }
      }
    });
    // console.log(q);
    // console.log(q.length);
    visited.add(nextVertex.identifier());
  }


  return maxDist;
}
//Guess 798 too high

//Note making the machines objects each with their own pointers & version of the code could simplify the code below
readFile(`15.txt`, ',')
  .then(async (res) => {
    let codes = res.map(v => Number(v));
    const explorationOrder = [4, 2, 3, 1];

    let robot = new IntCodeProgram(codes, 0, 0); //initialze robot
    let curPos = { x: 0, y: 0 };
    let start = new Vertex(curPos);//start position
    let endVertex = null;

    let curVtx = start;
    let dir = 0; //always go right
    // let numExit = 100;

    let seenSoFar = { [posToString(curPos)]: start };
    do {
      // if (--numExit < 0) break;
      let statusCode = robot.analyze([explorationOrder[dir]]);
      if (isNaN(statusCode)) break;
      // if (curPos.x === 0 && curPos.y === 0) {
      //   // console.log('curPos:', curPos);
      //   console.log('dir:', explorationOrder[dir]);
      //   console.log('statusCode:', statusCode);
      //   console.log('curVtx:', curVtx)
      //   // console.log('neighbours', curVtx.neighbours);
      // }


      if (statusCode === 1 || statusCode === 2) {
        updatePos(curPos, explorationOrder[dir]);
        // console.log('newPos:', curPos);
        let tmpVtx = seenSoFar[posToString(curPos)];
        if (!tmpVtx) {
          tmpVtx = new Vertex({ ...curPos });
          seenSoFar[posToString(curPos)] = tmpVtx;
        }
        if (statusCode === 2) {
          endVertex = tmpVtx;
        }
        curVtx.addNeighbour(tmpVtx, explorationOrder[dir]);
        curVtx = tmpVtx;
        dir = (dir + 1) % 4; //always change directions

      } else if (statusCode === 0) {
        curVtx.addWall(explorationOrder[dir]);
        dir = (dir + 3) % 4;
        // console.log('changing direction to ', explorationOrder[dir]);
      }
      // console.log('\n\n');
    } while (curPos.x !== 0 || curPos.y !== 0 ||
    curVtx.neighbours[0] === undefined
    || curVtx.neighbours[1] === undefined
    || curVtx.neighbours[2] === undefined
      || curVtx.neighbours[3] === undefined
    );

    endVertex.dist = 0;//start djikstra @ the end vertex, find max distance instance
    let dist = modifiedDjikstra(seenSoFar, start, endVertex);
    console.log('dist:', dist)
  });




//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const util = require('util');
const { MazeNode } = require('./MazeNode2');

const nodeLookup = {};

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.split(splitToken));
    });
  })
};

const makeCopy = arr => {
  return arr.map(line => line.slice());
};

const findPortals = maze => {
  let portals = [];

  maze.forEach((line, i) => {
    line.forEach((letter, j) => {

      if (letter.search(/[A-Z]/) !== -1) {
        let type = "INNER_PORTAL";
        if (i < 3 || i > maze.length - 4 || j < 3 || j > maze[0].length - 4) {
          type = "OUTER_PORTAL";
        }
        if (maze[i + 1] && maze[i + 1][j].search(/[A-Z]/) !== -1) {
          //this is a portal opening down/up
          if (maze[i - 1] && maze[i - 1][j] === '.') {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i + 1][j],
              loc: [i - 1, j],
              type
            });
          } else if (maze[i + 2] && maze[i + 2][j] === '.') {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i + 1][j],
              loc: [i + 2, j],
              type
            });
          }
          maze[i][j] = '#';
          maze[i + 1][j] = '#';
        }
        else if (maze[i] && maze[i][j + 1].search(/[A-Z]/) !== -1) {
          //this is a portal opening down/up
          if (maze[i][j - 1] && maze[i][j - 1] === ('.')) {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i][j + 1],
              loc: [i, j - 1],
              type
            });
          } else if (maze[i][j + 2] && maze[i][j + 2] === ('.')) {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i][j + 1],
              loc: [i, j + 2],
              type
            });
          }
          maze[i][j] = '#';
          maze[i][j + 1] = '#';
        }
      }
    })
  });
  return portals;

}

const removeDeadEnds = maze => {
  // let mazeCopy = makeCopy(maze);

  const checkDeadEnd = (i, j) => {
    //Valid if it's not a hallway (only paths are both up/down or left/right)
    let count = 0
    if (maze[i + 1] && maze[i + 1][j] === '#') { //down
      count++;
    }
    if (maze[i - 1] && maze[i - 1][j] === '#') { //up
      count++;
    }
    if (maze[i][j + 1] && maze[i][j + 1] === '#') { //right
      count++;
    }
    if (maze[i][j - 1] && maze[i][j - 1] === '#') { //left
      count++;
    }

    return count === 3;
  }

  const getDirection = (i, j) => {
    if (maze[i + 1] && maze[i + 1][j] === '.') { //down
      return [1, 0];
    }
    if (maze[i - 1] && maze[i - 1][j] === '.') { //up
      return [-1, 0];
    }
    if (maze[i][j + 1] && maze[i][j + 1] === '.') { //right
      return [0, 1];
    }
    if (maze[i][j - 1] && maze[i][j - 1] === '.') { //left
      return [0, -1]
    }

    return [0, 0];
  }

  const recursivelyRemove = (i, j) => {
    if (checkDeadEnd(i, j)) {
      let dir = getDirection(i, j);
      if (dir[0] === 0 && dir[1] === 0) return;
      maze[i][j] = '#';
      recursivelyRemove(i + dir[0], j + dir[1]);
    }
  }



  maze.forEach((line, i) => {
    line.forEach((letter, j) => {
      if (letter === '.') {
        recursivelyRemove(i, j);
      }
    });
  });

  return maze;


}

const markImportantPoints = maze => {
  let mazeCopy = makeCopy(maze);
  const checkValid = (i, j) => {
    //Valid if it's not a hallway (only paths are both up/down or left/right)
    let horiz = 0;
    let vert = 0;
    if (maze[i + 1] && maze[i + 1][j] === '.') { //down
      horiz++;

    }
    if (maze[i - 1] && maze[i - 1][j] === '.') { //up
      horiz++;
    }
    if (maze[i][j + 1] && maze[i][j + 1] === '.') { //right
      vert++;
    }
    if (maze[i][j - 1] && maze[i][j - 1] === '.') { //left
      vert++;
    }
    if (horiz + vert !== 2) return true;
    if (horiz !== 2 && vert !== 2) return true;

    return false;
  }

  maze.forEach((line, i) => {
    line.forEach((letter, j) => {
      if (letter === '.' && checkValid(i, j)) {
        mazeCopy[i][j] = 'O';
      }

    })
  });

  return mazeCopy;
}



const getId = (i, j) => {
  return `${i},${j}`;
}

const createGraph = (maze, portals) => {
  let start = [];
  let end = [];

  const addChildren = (node, i, j) => {

    const checkDirection = (multx, multy) => {
      let incr = 0;
      while (true) {
        incr++;
        // console.log(i + incr * multx)
        // console.log(j + incr * multy)

        if (!maze[i + incr * multx]) break;
        if (!maze[i + incr * multx][j + incr * multy]) break;

        if (maze[i + incr * multx][j + incr * multy] === '#' || maze[i + incr * multx][j + incr * multy] === ' ') break;

        if (maze[i + incr * multx][j + incr * multy] === 'O') {
          let id = getId(i + incr * multx, j + incr * multy);
          if (!nodeLookup[id]) {
            nodeLookup[id] = new MazeNode(i + incr * multx, j + incr * multy);
          }
          node.addChild(nodeLookup[id], incr);
          break;
        };
      }
    }
    checkDirection(0, 1);
    checkDirection(0, -1);
    checkDirection(1, 0);
    checkDirection(-1, 0);

  }

  //Loop through each O and find connection in each direction
  maze.forEach((line, i) => {
    line.forEach((letter, j) => {
      if (letter === 'O') {
        let id = getId(i, j);
        if (!nodeLookup[id]) {
          nodeLookup[id] = new MazeNode(i, j);
        }
        addChildren(nodeLookup[id], Number(i), Number(j));
      }
    });
  });

  //Go through portals and make the relationships between the nodes

  //Mark the start portal and end protal
  console.log(maze.length);
  console.log(maze[0].length)
  console.log(portals);

  portals.forEach((portal, i) => {
    const portalId = getId(portal.loc[0], portal.loc[1]);
    if (portal.name === 'AA') {
      start = nodeLookup[portalId];
    } else if (portal.name === 'ZZ') {
      end = nodeLookup[portalId];
    } else {
      portals.forEach((otherPortal, j) => {
        const otherPortalId = getId(otherPortal.loc[0], otherPortal.loc[1]);

        if (otherPortal.name === portal.name &&
          (otherPortal.loc[0] !== portal.loc[0] || otherPortal.loc[1] !== portal.loc[1])) {
          //Grabs the matching portal
          nodeLookup[portalId].addChild(nodeLookup[otherPortalId], 1, portal.type); //make a connection between the portals
        }
      });
    }

  });


  return [start, end];
}

const dijkstra = (start, end) => {
  let seen = new Set();
  start.dist = 0;
  let priorityQueue = [start.id()];

  while (true) {
    priorityQueue.sort((a, b) => nodeLookup[a].dist - nodeLookup[b].dist);
    let curNodeId = priorityQueue.shift();
    let curNode = nodeLookup[curNodeId];

    if (curNode === end) {
      return end.dist;
    }
    if (!seen.has(curNodeId)) {
      //update distances of all children:
      for (let child of curNode.children) {
        if (child.node.dist > curNode.dist + child.weight) {
          child.node.dist = curNode.dist + child.weight;
        }
        priorityQueue.push(child.node.id());
      }
      seen.add(curNodeId);
    }
  }

}

readFile(`ex1.in`, '\n')
  .then(async (maze) => {
    maze = maze.map(line => line.split(''));
    console.log(maze.map(line => line.join('')).join('\n'));

    let portals = findPortals(makeCopy(maze));

    console.log(maze.map(line => line.join('')).join('\n'));
    // console.log('portals:', portals);

    //Optimizations:
    //Close dead ends (look for paths with 3 walls)
    let simplifiedMaze = removeDeadEnds(makeCopy(maze));
    console.log(simplifiedMaze.map(line => line.join('')).join('\n'));

    //Dumb guess. 1288 is too high
    // console.log(simplifiedMaze.reduce((count, line) => { return count + line.reduce((p, c) => { if (c === '.') return p + 1; return p }, 0) }, 0));

    //TODO
    //Create graph from maze
    let markedMaze = markImportantPoints(simplifiedMaze); //barely helps. Lets just do a BFS instead of Djikstra
    // console.log(markedMaze.map(line => line.join('')).join('\n'));
    const [start, end] = createGraph(markedMaze, portals);
    // Object.keys(nodeLookup).forEach(key => console.log(`${key}: ${nodeLookup[key].children.map(c => `${c.node.i},${c.node.j} [${c.weight}]`).join('//')}`));

    dijkstra(start, end);
    console.log(end.dist);
  });




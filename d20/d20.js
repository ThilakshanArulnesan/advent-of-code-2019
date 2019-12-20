//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const util = require('util');
const { MazeNode } = require('./MazeNode');


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
        if (maze[i + 1] && maze[i + 1][j].search(/[A-Z]/) !== -1) {
          //this is a portal opening down/up
          if (maze[i - 1] && maze[i - 1][j] === '.') {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i + 1][j],
              loc: [i - 1, j]
            });
          } else if (maze[i + 2] && maze[i + 2][j] === '.') {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i + 1][j],
              loc: [i + 2, j]
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
              loc: [i, j - 1]
            });
          } else if (maze[i][j + 2] && maze[i][j + 2] === ('.')) {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i][j + 1],
              loc: [i, j + 2]
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

readFile(`20.in`, '\n')
  .then(async (maze) => {
    maze = maze.map(line => line.split(''));
    console.log(maze.map(line => line.join('')).join('\n'));

    let portals = findPortals(makeCopy(maze));

    console.log(maze.map(line => line.join('')).join('\n'));
    console.log('portals:', portals);

    //Optimizations:
    //Close dead ends (look for paths with 3 walls)
    let simplifiedMaze = removeDeadEnds(makeCopy(maze));
    console.log(simplifiedMaze.map(line => line.join('')).join('\n'));

    //Dumb guess. 1288 is too high
    console.log(simplifiedMaze.reduce((count, line) => { return count + line.reduce((p, c) => { if (c === '.') return p + 1; return p }, 0) }, 0));

    //TODO
    //Create graph from maze
    let markedMaze = markImportantPoints(simplifiedMaze); //barely helps. Lets just do a BFS instead of Djikstra
    console.log(markedMaze.map(line => line.join('')).join('\n'));


  });




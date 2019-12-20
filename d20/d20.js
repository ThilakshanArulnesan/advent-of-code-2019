//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const util = require('util');


const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.split(splitToken));
    });
  })
};

const findPortals = maze => {
  let portals = [];

  maze.forEach((line, i) => {
    line.forEach((letter, j) => {

      if (letter.search(/[A-Z]/) !== -1) {
        if (maze[i + 1] && maze[i + 1][j].search(/[A-Z]/) !== -1) {
          //this is a portal opening down/up
          if (maze[i - 1] && maze[i - 1][j].indexOf('.') !== -1) {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i + 1][j],
              loc: [i - 1, j]
            });
          } else if (maze[i + 2] && maze[i + 2][j].indexOf('.') !== -1) {
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
          if (maze[i][j - 1] && maze[i][j - 1].indexOf('.') !== -1) {
            //opening to portal
            portals.push({
              name: maze[i][j] + maze[i][j + 1],
              loc: [i, j - 1]
            });
          } else if (maze[i][j + 2] && maze[i][j + 2].indexOf('.') !== -1) {
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

readFile(`ex2.in`, '\n')
  .then(async (maze) => {
    maze = maze.map(line => line.split(''));
    console.log(maze.map(line => line.join('')).join('\n'));

    let portals = findPortals(maze);
    console.log(maze.map(line => line.join('')).join('\n'));
    console.log('portals:', portals);

    //Optimizations:
    //Close dead ends (look for paths with 3 walls)

    //TODO
    //Create graph from maze
    //
  });




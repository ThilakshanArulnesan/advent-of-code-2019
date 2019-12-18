class Traverser {

  constructor(start, maze, keysFound = new Set(), numKeys, stepsTaken = 0) {
    this.stepsTaken = 0;
    this.keysFound = new Set(keysFound);//Make a clone
    this.numKeys = numKeys;
    this.stack = [...stack];
    this.botNum = botNum;
    this.location = start;
    this.maze = maze;
  }

  isVisitable(i, j) {
    if (this.numVisitable[i][j] > 0) {
      return true;
    } else {
      return false;
    }
  }

  getVisitable() {
    let visitable = [];
    let i = this.location[0];
    let j = this.location[1];

    if (this.numVisitable[i + 1] && this.numVisitable[i + 1][j] === '.') {
      visitable.push([i + 1, j]);
    }
    if (this.numVisitable[i - 1] && this.numVisitable[i - 1][j] === '.') {
      visitable.push([i - 1, j]);
    }
    if (this.numVisitable[i][j + 1] === '.') {
      visitable.push([i, j + 1]);
    }
    if (this.numVisitable[i][j - 1] === '.') {
      visitable.push([i, j - 1]);
    }

    return visitable;
  }

  getCode(i, j) {
    return `${i},${j}`;
  }


  resetMaze() {
    //Every time we find a key, allow backtracking
    this.maze = this.maze.map(line => line.map(char => {
      if (char === '|') {
        return '.';
      } else {
        return char;
      }
    }));
  }

  visit(i, j, dir) {
    this.stepsTaken++;
    if (this.maze[i][j].search(/[a-z]/) !== -1) {
      this.keysFound.add(this.maze[i][j]);
      this.resetMaze(); //allow backtracking
    } else {
      this.maze[i, j] = '|'; //prevent backtracking
    }
    this.location = [i, j];
  }

  finished() {
    return this.keysFound.size === this.numKeys;
  }


}
module.exports = { Traverser };
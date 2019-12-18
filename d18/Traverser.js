class Traverser {

  constructor(start, maze, keysFound = new Set(), numKeys, stepsTaken = 0) {
    this.stepsTaken = stepsTaken;
    this.keysFound = new Set(keysFound);//Make a clone
    this.numKeys = numKeys;
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

  canVisit(char) {
    //If its a key, a path, or a door with a key we have found, we can visit
    // console.log(char, char.search(/[a-z]|\./) !== -1, this.keysFound.has(char));
    return char.search(/[a-z]|\./) !== -1 || this.keysFound.has(char);
  }

  getVisitable() {
    let visitable = [];
    let i = this.location[0];
    let j = this.location[1];

    this.maze[i][j] = '|'; //prevent backtracking

    if (this.maze[i + 1] && this.canVisit(this.maze[i + 1][j])) {
      visitable.push([i + 1, j]);
    }
    if (this.maze[i - 1] && this.canVisit(this.maze[i - 1][j])) {
      visitable.push([i - 1, j]);
    }
    if (this.canVisit(this.maze[i][j + 1])) {
      visitable.push([i, j + 1]);
    }
    if (this.canVisit(this.maze[i][j - 1])) {
      visitable.push([i, j - 1]);
    }
    // console.log(`From (${i},${j}) we can visit `, visitable)
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

  visit(i, j) {
    this.stepsTaken++;
    if (this.maze[i][j].search(/[a-z]/) !== -1) {
      this.keysFound.add(this.maze[i][j].toUpperCase());
      this.resetMaze(); //allow backtracking
    }
    this.location = [i, j];
  }

  finished() {
    return this.keysFound.size === this.numKeys;
  }


}
module.exports = { Traverser };
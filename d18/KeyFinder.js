class KeyFinder {

  constructor(start, maze, doorsInTheWay = new Set(), goal, stepsTaken = 0, botNum = 0) {
    this.stepsTaken = stepsTaken;
    this.doorsInTheWay = new Set(doorsInTheWay);//Make a clone
    this.location = start;
    this.maze = maze;
    this.goal = goal;
    this.botNum = botNum;
  }

  canVisit(char) {
    //If its a key, a path, or a door with a key we have found, we can visit
    // console.log(char, char.search(/[a-z]|\./) !== -1, this.keysFound.has(char));

    return char.search(/#|-/) === -1;
  }

  getVisitable() {
    let visitable = [];
    let i = this.location[0];
    let j = this.location[1];
    if (this.maze[i][j].search(/[A-Z]/) !== -1) {
      // console.log('adding', this.maze[i][j]);
      this.doorsInTheWay.add(this.maze[i][j])
    }


    this.maze[i][j] = '-'; //prevent backtracking

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

    return visitable;
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
    this.location = [i, j];
  }

  finished() {
    return (this.location[0] === this.goal[0]) && (this.location[1] === this.goal[1]);
  }
}
module.exports = { KeyFinder };
class Traverser {
  // Stack of direction travelled
  // Set of visited nodes
  // copy of visited node count
  constructor(start, numVisitable, uniqueSet = new Set(), numToVisit, stack = [], botNum = 0) {
    this.uniqueSet = new Set(uniqueSet);//Make a clone
    this.numToVisit = numToVisit;
    this.stack = [...stack];
    this.botNum = botNum;

    this.location = start;
    this.numVisitable = numVisitable;
  }

  isVisitable(i, j) {
    if (this.numVisitable[i][j] > 0) {
      return true;
    } else {
      return false;
    }
  }

  getVisitable2() {
    let visitable = [];
    let i = this.location[0];
    let j = this.location[1];

    let lastMove = this.stack[this.stack.length - 1];

    if (lastMove !== 'N' && this.numVisitable[i + 1] && this.numVisitable[i + 1][j] > 0) {
      visitable.push([i + 1, j, 'S']);
    }
    if (lastMove !== 'S' && this.numVisitable[i - 1] && this.numVisitable[i - 1][j] > 0) {
      visitable.push([i - 1, j, 'N']);
    }
    if (lastMove !== 'W' && this.numVisitable[i][j + 1] > 0) {
      visitable.push([i, j + 1, 'E']);
    }
    if (lastMove !== 'E' && this.numVisitable[i][j - 1] > 0) {
      visitable.push([i, j - 1, 'W']);
    }

    return visitable;
  }

  getVisitable() {
    let visitable = [];
    let i = this.location[0];
    let j = this.location[1];

    let lastMove = this.stack[this.stack.length - 1];
    if (lastMove === 'N' && this.numVisitable[i - 1] && this.numVisitable[i - 1][j] > 0) {
      return [[i - 1, j, 'N']];
    } else if (lastMove === 'S' && this.numVisitable[i + 1] && this.numVisitable[i + 1][j] > 0) {
      return [[i + 1, j, 'S']];
    } else if (lastMove === 'E' && this.numVisitable[i][j + 1] > 0) {
      return [[i, j + 1, 'E']];
    } else if (lastMove === 'W' && this.numVisitable[i][j - 1] > 0) {
      return [[i, j - 1, 'W']];
    }



    if (lastMove !== 'N' && this.numVisitable[i + 1] && this.numVisitable[i + 1][j] > 0) {
      return [[i + 1, j, 'S']];
    }
    if (lastMove !== 'S' && this.numVisitable[i - 1] && this.numVisitable[i - 1][j] > 0) {
      return [[i - 1, j, 'N']];
    }
    if (lastMove !== 'W' && this.numVisitable[i][j + 1] > 0) {
      return [[i, j + 1, 'E']];
    }
    if (lastMove !== 'E' && this.numVisitable[i][j - 1] > 0) {
      return [[i, j - 1, 'W']];
    }
    return visitable;
  }


  getCode(i, j) {
    return `${i},${j}`;
  }

  visit(i, j, dir) {
    this.stack.push(dir); //use stack size to check completion.
    this.uniqueSet.add(this.getCode(i, j));
    this.location = [i, j];
    this.numVisitable[i][j]--;
  }

  visitedAll() {
    return this.uniqueSet.size === this.numToVisit;
  }


}
module.exports = { Traverser };
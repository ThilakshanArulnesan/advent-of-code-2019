//This file is from another attempt at part 1 where I attempted a BFS of the keyspace rather than Djikstra.
class KeyTraverser {

  constructor(keysFound, currentKey, stepsTaken, keyMapping) {

    this.keysFound = keysFound.slice();
    this.currentKey = currentKey;
    this.stepsTaken = stepsTaken;
    this.keyMapping = keyMapping;
    this.keys = Object.keys(keyMapping);
    this.totalKeys = Object.keys(keyMapping).length;
  }

  // Check if we have the required keys for all the doors that are in the way
  haveRequiredKeys(key) {

    for (let door of this.keyMapping[this.currentKey][key].doorsInTheWay) {
      if (!this.keysFound.includes(door.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  getPossibleMoves() {
    let moves = [];
    // console.log(this.keys);
    for (let key of this.keys) {
      if (this.keysFound.includes(key)) continue; //don't go back to keys we've already found
      if (this.haveRequiredKeys(key)) {
        moves.push(key);
      }
    }
    // return moves.sort((a, b) => this.keyMapping[this.currentKey][a].steps - this.keyMapping[this.currentKey][b].steps);
    return moves;
  }

  makeMove(move) {
    this.stepsTaken += this.keyMapping[this.currentKey][move].steps;
    this.keysFound.push(move);
    this.currentKey = move;
  }

  finished() {
    return (this.keysFound.length === this.totalKeys);
  }
}
module.exports = { KeyTraverser };
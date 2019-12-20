class MazeNode { //Assume maze is all connected
  //location
  //children : Array of objects {childName: dist}
  //distance to get to the node
  constructor(i, j, dist = Infinity) {
    this.i = i;
    this.j = j;
    this.dist = dist;
    this.children = [];
  }

  //Helpers:
  id() {
    return `${i},${j}`;
  }

  addChild(nodeName, weight = Infinity) {
    this.children.push({ childName: nodeName, weight: weight });
  }
}
module.exports = { MazeNode }
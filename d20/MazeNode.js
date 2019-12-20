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

  addChild(node, weight = Infinity) {
    this.children.push({ node: node, weight: weight });
  }
}
module.exports = { MazeNode }
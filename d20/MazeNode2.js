class MazeNode { //Assume maze is all connected
  //location
  //children : Array of objects {childName: dist}
  //distance to get to the node
  constructor(i, j, dist = Infinity) {
    this.i = i;
    this.j = j;
    this.dist = [dist];
    this.children = [];
  }

  //Helpers:
  id() {

    return `${this.i},${this.j}`;
  }

  //We need to store the type of edge (inner portal, outer portal, or default(not a portal))
  addChild(node, weight = Infinity, type = 'DEFAULT') {
    this.children.push({ node: node, weight: weight, type: type });
  }
}
module.exports = { MazeNode }
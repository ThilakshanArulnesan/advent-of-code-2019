class Vertex {

  constructor(pos, north, east, south, west) {
    this.pos = pos;
    this.neighbours = [north, south, west, east];
    this.dist = Infinity;
  }

  addNeighbour(neighbour, dir = 1) {
    //links neigbors together.
    this.neighbours[dir - 1] = neighbour;

    //Get opposite direction (N => S, S=>N, E=>W, W=>E)
    if (dir === 1) {
      dir = 2;
    } else if (dir === 2) {
      dir = 1;
    } else if (dir === 3) {
      dir = 4
    } else if (dir === 4) {
      dir = 3;
    }

    neighbour.neighbours[dir - 1] = this;
  }

  addWall(dir = 1) {
    this.neighbours[dir - 1] = null;
  }

  identifier() {
    return `${this.pos.x},${this.pos.y}`;
  }

}

module.exports = { Vertex };
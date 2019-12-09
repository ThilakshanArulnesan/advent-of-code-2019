class Planet {

  constructor(name, depth, orbit) {
    this.name = name;
    this.depth = depth;
    this.orbit = orbit; //planet it orbits
    this.children = [];
  }

  addChild(planet) {
    this.children.push(planet);
  }




  depth() {
    let d = 1;
    let orb = this.orbit;
    while (orb !== null) {
      d++;
      orb = orb.orbit;
    }
    return d;
  }
}

module.exports = { Planet };
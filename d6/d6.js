//Part 2
const fs = require('fs');
const { Planet } = require('./Planet');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

const createMap = (arr) => {
  let map = [];
  for (let relation of arr) {
    let matches = relation.split(')');
    map.push(matches);
  }
  return map;
}

const getTotalDepth = (planet) => {

  let totDepthChildren = 0;
  for (let child of planet.children) {
    totDepthChildren += getTotalDepth(child);
  }

  return planet.depth + totDepthChildren;
}

readFile(`6.txt`, '\n')
  .then(res => {
    let map = createMap(res);
    let root = new Planet("COM", 0, null);
    let curPlanet = root;
    let q = [curPlanet];

    //Create a tree showing the relationships
    while (q.length > 0) {
      curPlanet = q.shift();
      console.log(curPlanet);
      map.filter(v => v[0] === curPlanet.name).forEach(v => {
        let newPlanet = new Planet(v[1], curPlanet.depth + 1, curPlanet);
        curPlanet.addChild(newPlanet);
        q.push(newPlanet);
      });

      map = map.filter(v => v[0] !== q[0]); //remove the matches
    }

    //Do a depth first search for the total depth
    console.log(getTotalDepth(root));

  });


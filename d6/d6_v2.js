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

const getOrbits = planet => {
  let orbits = [];
  let curPlanet = planet;
  while (curPlanet.orbit !== null) {
    curPlanet = curPlanet.orbit;
    orbits.push(curPlanet.name);
  }

  return orbits.reverse();

}

readFile(`6.txt`, '\n')
  .then(res => {
    let map = createMap(res);
    let root = new Planet("COM", 0, null);
    let san = null;
    let you = null;
    let curPlanet = root;
    let q = [curPlanet];

    //Create a tree showing the relationships
    while (q.length > 0) {
      curPlanet = q.shift();
      // console.log(curPlanet);
      map.filter(v => v[0] === curPlanet.name).forEach(v => {
        let newPlanet = new Planet(v[1], curPlanet.depth + 1, curPlanet);
        if (v[1] === 'SAN') san = newPlanet;
        if (v[1] === 'YOU') you = newPlanet;
        curPlanet.addChild(newPlanet);
        q.push(newPlanet);
      });

      map = map.filter(v => v[0] !== q[0]); //remove the matches
    }

    //Get all parent orbits
    let yourOrbits = getOrbits(you);
    let santaOrbits = getOrbits(san);

    //Remove all common parents, leaving only the most 'common ancestor'
    while (true) {
      if (yourOrbits[0] === santaOrbits[0]) {
        yourOrbits.shift();
        santaOrbits.shift();
      } else {
        break;
      }
    }


    console.log(yourOrbits.length + santaOrbits.length); //Sum the length of the two arrays left
    //Note we don't include the first common ancestor (one less than number of planets between you and santa)
    //This is because we are counting TRANSFERS btwn planets (which will always be n-1 where n is the number of planents between you and santa)

  });


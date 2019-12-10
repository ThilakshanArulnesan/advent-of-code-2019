const fs = require('fs');
const chalk = require('chalk');
const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};


readFile(`ex.txt`, '\n')
  .then(res => {
    let asteroidLocations = [];
    let matrix = [];
    for (let [i, val] of res.entries()) {
      matrix[i] = [];
      for (let j in val) {
        let letter = val[j];
        matrix[i].push(letter);
        if (letter === '#') {
          asteroidLocations.push({ x: Number(j), y: i })
        }
      }
    }
    mapping = {};
    bestMapping = {};
    bestAsteroid = {};
    let maxSoFar = 0;
    asteroidLocations.forEach((asteroid, i, asteroidLocations) => {
      let angles = new Set(); //store the slopes found so far (round to 4 dec. to avoid decimal approx errors)
      let numAsteroids = 0;

      for (let otherAsteroid of asteroidLocations) {
        if (otherAsteroid === asteroid) continue;

        let dy = -(otherAsteroid.y - asteroid.y); //Up is down and down is up
        let dx = otherAsteroid.x - asteroid.x

        let angle = Math.acos(dy / Math.sqrt(dx ** 2 + dy ** 2)); //Four decimals (arbritrary, would need more as size of puzzle increases)
        if (dx < 0) { // Corrects based on the quadrant since acos(x) maps angles >180 to angles < 180
          if (dy < 0) {
            angle = angle + Math.PI / 2;
          } else if (dy > 0) {
            angle = angle + 3 * Math.PI / 2;
          } else if (dy === 0) {
            angle = angle + Math.PI;
          }
        }

        if (isNaN(angle)) { //Angle is 90 or 270
          if (dy > 0) {
            angle = Math.PI / 2;
          } else {
            angle = 3 * Math.PI / 2
          }
        }

        angle = Math.round(angle * 1000) / 1000;
        if (!mapping[angle]) {
          mapping[angle] = [];
          mapping[angle].push(otherAsteroid);
        } else {
          mapping[angle].push(otherAsteroid);
        }
        // console.log(angle);
        if (asteroid.x === 2 && asteroid.y === 2) {
          console.log(`Asteroid ${otherAsteroid.x},${otherAsteroid.y} has an angle of: ${angle}. dx=${dx}, dy=${dy}`);
        }

        if (!angles.has(angle)) {
          angles.add(angle);
          numAsteroids++;
        }

      }
      if (numAsteroids >= maxSoFar) {
        console.log(`Best is at ${asteroid.x},${asteroid.y}`)
        maxSoFar = numAsteroids;
        bestAsteroid = asteroid;
        bestMapping = { ...mapping };
      }

      mapping = {}; //reset
      // return { loc: asteroid, num: numAsteroids };
    });
    let sortedKeys = Object.keys(bestMapping).sort((a, b) => a - b);
    console.log(sortedKeys);
    let count = 0;
    while (count < 1) {
      for (let angle of sortedKeys) {
        console.log(angle, bestMapping[angle].map((ast) => {
          return { x: ast.x - bestAsteroid.x, y: ast.y - bestAsteroid.y }
        }));
        if (bestMapping[angle].length > 0) {
          count++;
          let closest = (bestMapping[angle][0].x - bestAsteroid.x) ** 2 + (bestMapping[angle][0].y - bestAsteroid.y) ** 2;

          let poppedAsteroid = bestMapping[angle].reduce((prevBest, current) => {
            if ((current.x - bestAsteroid.x) ** 2 + (current.y - bestAsteroid.y) ** 2 <= closest) {
              return current;
            } else {
              return prevBest;
            }
          }, bestMapping[angle][0]);

          bestMapping[angle] = bestMapping[angle].filter(asteroid => asteroid !== poppedAsteroid);//pew pew

          console.log(`The ${chalk.blue(count)} asteroid to be vaporized is at ${poppedAsteroid.x}, ${poppedAsteroid.y} (${poppedAsteroid.x - bestAsteroid.x},${poppedAsteroid.y - bestAsteroid.y})`)
          if (count === 200) {
            console.log(poppedAsteroid);
          }
        }
      }
    }
  }); 
//Part 2 required a refactor of part 1 to include angles in order to solve this part more easily.

const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};


readFile(`10.txt`, '\n')
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
    let bestMapping = {};
    let bestAsteroid = {};
    let maxSoFar = 0; //Stores count of max number of asteroids

    asteroidLocations.forEach((asteroid, i, asteroidLocations) => {
      mapping = {};
      let angles = new Set(); //store the slopes found so far (round to 4 dec. to avoid decimal approx errors)
      let numAsteroids = 0;

      for (let otherAsteroid of asteroidLocations) {
        if (otherAsteroid === asteroid) continue;

        let dy = -(otherAsteroid.y - asteroid.y); //Up is down and down is up
        let dx = otherAsteroid.x - asteroid.x

        let angle = Math.acos(dy / Math.sqrt(dx ** 2 + dy ** 2)); //Four decimals (arbritrary, would need more as size of puzzle increases)

        if (dx < 0) { // Corrects based on the quadrant since acos(x) maps angles >180 to angles < 180
          if (dy === 0) { //180 degrees
            angle = angle + Math.PI;
          } else {
            angle = 2 * Math.PI - angle;
          }
        }

        if (isNaN(angle)) { //Angle is 90 or 270
          if (dy > 0) {
            angle = Math.PI / 2;
          } else {
            angle = 3 * Math.PI / 2
          }
        }

        angle = Math.round(angle * 100000) / 100000;
        if (!mapping[angle]) {
          mapping[angle] = [];
          mapping[angle].push(otherAsteroid);
        } else {
          mapping[angle].push(otherAsteroid);
        }

        if (!angles.has(angle)) {
          angles.add(angle);
          numAsteroids++;
        }

      }
      if (numAsteroids >= maxSoFar) {
        maxSoFar = numAsteroids;
        bestAsteroid = asteroid;
        bestMapping = { ...mapping };
      }
    });

    let sortedKeys = Object.keys(bestMapping).sort((a, b) => a - b);

    let count = 0;
    while (count < 200) { //we want the 200th match
      for (let angle of sortedKeys) {
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

          if (count === 200) {
            console.log(poppedAsteroid); //Solution 
          }
        }
      }
    }
  }); 
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

    let asteroidCount = asteroidLocations.map((asteroid, i, asteroidLocations) => {
      let slopes = {}; //store the slopes found so far (round to 4 dec. to avoid decimal approx errors)
      let numAsteroids = 0;
      for (let otherAsteroid of asteroidLocations) {
        if (otherAsteroid === asteroid) continue;
        //Note slopes of infinity are allowed (vertical line)
        let dy = otherAsteroid.y - asteroid.y;
        let dx = otherAsteroid.x - asteroid.x

        let slope = Math.round(dy / dx * 10000) / 10000; //Four decimals (arbritrary, would need more as size of puzzle increases)

        if (slopes[slope] === undefined) {
          if (dy > 0) {
            slopes[slope] = [true, false];
          } else if (dy < 0) {
            slopes[slope] = [false, true];
          } else {//dy = 0
            if (dx > 0) {
              slopes[slope] = [true, false];
            } else {
              slopes[slope] = [false, true];
            }
          }
          numAsteroids++;
        }
        else if (dy > 0 && !slopes[slope][0]) {
          slopes[slope] = [true, true];
          numAsteroids++;
        } else if (dy < 0 && !slopes[slope][1]) {
          slopes[slope] = [true, true];
          numAsteroids++;
        } else if (dy === 0) {
          if (dx > 0 && !slopes[slope][0]) {
            slopes[slope] = [true, true];
            numAsteroids++;
          } else if (dx < 0 && !slopes[slope][1]) {
            slopes[slope] = [true, true];
            numAsteroids++;
          }
        }


      }

      return { loc: asteroid, num: numAsteroids };
    });
    console.log(asteroidCount);
    let bestAsteroid = asteroidCount.reduce((p, c) => c.num > p.num ? c : p, asteroidCount[0]);
    console.log(bestAsteroid);
  });

/*Solution using angles instead

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

  let asteroidCount = asteroidLocations.map((asteroid, i, asteroidLocations) => {
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

      angle = Math.round(angle * 10000) / 10000;
      // console.log(angle);
      if (asteroid.x === 2 && asteroid.y === 2) {
        console.log(`Asteroid ${otherAsteroid.x},${otherAsteroid.y} has an angle of: ${angle}. dx=${dx}, dy=${dy}`);
      }

      if (!angles.has(angle)) {
        angles.add(angle);
        numAsteroids++;
      }

    }

    return { loc: asteroid, num: numAsteroids };
  });
  console.log(asteroidCount);
  let bestAsteroid = asteroidCount.reduce((p, c) => c.num > p.num ? c : p, asteroidCount[0]);
  console.log(bestAsteroid);
});




*/
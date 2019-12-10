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
    // console.log(matrix);
    // console.log(asteroidLocations);

    let asteroidCount = asteroidLocations.map((asteroid, i, asteroidLocations) => {
      let slopes = {}; //store the slopes found so far (round to 4 dec. to avoid decimal approx errors)
      let numAsteroids = 0;
      for (let otherAsteroid of asteroidLocations) {
        if (otherAsteroid === asteroid) continue;
        //Note slopes of infinity are allowed (vertical line)
        let dy = otherAsteroid.y - asteroid.y;
        let dx = otherAsteroid.x - asteroid.x

        let slope = Math.round(dy / dx * 10000) / 10000; //Four decimals (arbritrary, would need more as size of puzzle increases)
        // if (asteroid.x === 2 && asteroid.y === 2) {
        //   console.log(`Asteroid ${otherAsteroid.x},${otherAsteroid.y} has a slope of: ${slope}.`);
        // }

        if (slopes[slope] === undefined) {
          // if (asteroid.x === 2 && asteroid.y === 2) {
          //   console.log(`   Adding asteroid ${otherAsteroid.x},${otherAsteroid.y} (first time slope).`);
          // }
          if (dy > 0) {
            slopes[slope] = [true, false];
          } else if (dy < 0) {
            slopes[slope] = [false, true];
          } else { //dy = 0
            // if (asteroid.x === 2 && asteroid.y === 2) {
            //   console.log(`   In the else.`);
            // }
            if (dx > 0) {
              slopes[slope] = [true, false];
              // if (asteroid.x === 2 && asteroid.y === 2) {
              //   console.log(`   dx>0.`);
              // }
            } else {
              slopes[slope] = [false, true];
              // if (asteroid.x === 2 && asteroid.y === 2) {
              //   console.log(`   dx<0.`);
              // }
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
            // if (asteroid.x === 2 && asteroid.y === 2) {
            //   console.log(`   Adding asteroid ${otherAsteroid.x},${otherAsteroid.y} (dx>0 first time).`);
            // }
          } else if (dx < 0 && !slopes[slope][1]) {
            slopes[slope] = [true, true];
            numAsteroids++;
            // if (asteroid.x === 2 && asteroid.y === 2) {
            //   console.log(`   Adding asteroid ${otherAsteroid.x},${otherAsteroid.y} (dx< 0 first time).`);
            // }
          }
        }


      }

      return { loc: asteroid, num: numAsteroids };
    });
    console.log(asteroidCount);
    let bestAsteroid = asteroidCount.reduce((p, c) => c.num > p.num ? c : p, asteroidCount[0]);
    console.log(bestAsteroid);
  });
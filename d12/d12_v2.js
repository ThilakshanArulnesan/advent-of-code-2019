const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};
const updateVelocity = (moons) => {
  moons.forEach((moon) => {
    moons.forEach(otherMoon => {//O(m^2)...but m =4
      if (otherMoon !== moon) {
        moon.vel.x += Math.sign(otherMoon.pos.x - moon.pos.x);
        moon.vel.y += Math.sign(otherMoon.pos.y - moon.pos.y);
        moon.vel.z += Math.sign(otherMoon.pos.z - moon.pos.z);
      }
    })
  });
  return moons;
}

const updatePosition = (moons) => {
  moons.map(moon => {
    moon.pos.x += moon.vel.x;
    moon.pos.y += moon.vel.y;
    moon.pos.z += moon.vel.z;
  });
  return moons;
}

const checkX = (state, moons) => {
  for (let [i, moon] of moons.entries()) { //slow
    if (state[i].pos.x !== moon.pos.x
      || state[i].vel.x !== moon.vel.x
    ) {
      return false
    }
  }
  return true;
}

const checkY = (state, moons) => {
  for (let [i, moon] of moons.entries()) { //slow
    if (state[i].pos.y !== moon.pos.y
      || state[i].vel.y !== moon.vel.y
    ) {
      return false
    }
  }
  return true;
}

const checkZ = (state, moons) => {
  for (let [i, moon] of moons.entries()) { //slow
    if (state[i].pos.z !== moon.pos.z
      || state[i].vel.z !== moon.vel.z
    ) {
      return false
    }
  }
  return true;
}

const gcd = (a, b) => {
  if (a === 0) return b;
  if (b === 0) return a;

  return gcd(b, a % b);

}

const lcm = (arr) => {
  return arr.reduce((p, c) => p * c / gcd(p, c), 1);
}

readFile(`12.txt`, '\n')
  .then(moonInitialPos => {
    let moons = moonInitialPos.map(m => {
      let pos = {};
      pos.x = Number(m.match(/(?<=<x=)-?[0-9]*/)[0]);
      pos.y = Number(m.match(/(?<=y=)-?[0-9]*/)[0]);
      pos.z = Number(m.match(/(?<=z=)-?[0-9]*/)[0]);

      let vel = {};
      vel.z = vel.y = vel.x = 0;

      return {
        pos: pos,
        vel: vel
      };
    })

    let initialState = JSON.parse(JSON.stringify(moons));

    let i = 0;
    let xPeriodicity;
    let yPeriodicity;
    let zPeriodicity;
    while (true) {
      updateVelocity(moons);
      moons = updatePosition(moons);

      let totEn = moons.map(m => (Math.abs(m.vel.x) + Math.abs(m.vel.y) + Math.abs(m.vel.z))).reduce((p, c) => p + c, 0);

      if (checkX(initialState, moons) && !xPeriodicity) {
        xPeriodicity = i + 1;
      }

      if (checkY(initialState, moons) && !yPeriodicity) {
        yPeriodicity = i + 1;
      }

      if (checkZ(initialState, moons) && !zPeriodicity) {
        zPeriodicity = i + 1;
      }


      if (xPeriodicity && yPeriodicity && zPeriodicity) {
        break;
      }

      i++
    }

    console.log(xPeriodicity, yPeriodicity, zPeriodicity);

    let ans = lcm([xPeriodicity, yPeriodicity, zPeriodicity])
    console.log('ans:', ans);
  });

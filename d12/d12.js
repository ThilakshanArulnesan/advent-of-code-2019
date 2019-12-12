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
  moons.forEach((moon, i) => {
    moons.forEach(otherMoon => {
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
    for (let i = 0; i <= 999; i++) {
      console.log(`After ${i} steps:\n${moons.map(m => `pos=<x=${m.pos.x}, y=${m.pos.y}, z=${m.pos.z}>. vel=<x=${m.vel.x}, y= ${m.vel.y}, z=${m.vel.z},`).join('\n')}\n\n`);
      updateVelocity(moons);
      moons = updatePosition(moons);
    }
    console.log(`After ${1000} steps:\n${moons.map(m => `pos=<x=${m.pos.x}, y=${m.pos.y}, z=${m.pos.z}>. vel=<x=${m.vel.x}, y= ${m.vel.y}, z=${m.vel.z},`).join('\n')}\n\n`);
    let totEn = moons.map(m => (Math.abs(m.pos.x) + Math.abs(m.pos.y) + Math.abs(m.pos.z)) * (Math.abs(m.vel.x) + Math.abs(m.vel.y) + Math.abs(m.vel.z)))
      .reduce((p, c) => p + c, 0);
    console.log(totEn)
  });

//Part 2
const fs = require('fs');

const readFile = (filename) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split('\n'));
    });
  })
};

const getFuel = (mass) => {
  return Math.floor(mass / 3) - 2;
}

const recursivelyGetFuel = (mass) => {
  let amountOfFuel = getFuel(mass);
  if (amountOfFuel <= 0) {
    return 0;
  }
  return amountOfFuel + recursivelyGetFuel(amountOfFuel);
}

const getTotalFuel = function(masses) {
  // console.log(masses);
  let sum = 0;
  for (let mass of masses) {
    sum += getFuel(Number(mass));
  }
  console.log(masses.map(m => recursivelyGetFuel(m)).reduce((p, c) => p + c, 0));
  return sum;
}
readFile(`1.txt`)
  .then(res => console.log(getTotalFuel(res)));

// console.log(getTotalFuel(masses));
// Guess: 5010544
// a = recursivelyGetFuel(1969);

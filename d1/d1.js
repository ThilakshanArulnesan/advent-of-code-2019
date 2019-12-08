const fs = require('fs');

const readFile = (filename) => {
  return new Promise((res, rej) => {
    console.log("READING");
    fs.readFile(`./1.txt`, 'utf8', (err, data) => {
      if (err) throw err;
      // console.log(data.split('\n'));
      res(data.trim().split('\n'));
    });
  })
};

const getFuel = function(mass) {
  return Math.floor(mass / 3) - 2;
}

const getTotalFuel = function(masses) {
  console.log(masses);
  let sum = 0;
  for (let mass of masses) {
    sum += getFuel(Number(mass));
  }
  console.log(masses.map(m => getFuel(m)).reduce((p, c) => p + c, 0));
  return sum;
}
readFile(`1.txt`)
  .then(res => console.log(getTotalFuel(res)));

// console.log(getTotalFuel(masses));

const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

//Applies fft as described in problem
const fft = (input) => {
  const multipliers = [0, 1, 0, -1];
  let len = multipliers.length;
  let offset = 1;

  return input.map((v, i, a) => {
    let period = i + 1;
    return a.reduce((acc, curr, j) => {
      return acc + multipliers[Math.floor((j + offset) / period) % len] * curr;
    }, 0);
  })
    .map(v => {
      return Math.abs(v) % 10;
    });
}

const fftN = (input, n) => {
  let i = 0;
  let newInput = [...input];
  while (i < n) {
    newInput = fft(newInput);
    i++;
  }

  return newInput;

}

readFile(`16.in`, '')
  .then(data => {
    let numbers = data.map(n => Number(n));
    // console.log(numbers);
    console.log(fftN(numbers, 100).splice(0, 8));

  });

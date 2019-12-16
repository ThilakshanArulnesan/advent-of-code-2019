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
//[ 2, 4, 1, 7, 6, 1, 7, 6 ]
const fft = (input, msgOffset = 0) => {
  let out = new Array(msgOffset).fill(0);
  let appendArr = [];

  let prev = 0;
  for (let i = input.length - 1; i >= msgOffset; i--) {
    prev += input[i];
    appendArr.push(prev % 10);
  }
  appendArr = appendArr.reverse();
  appendArr.forEach(v => out.push(v));

  return out;
}

const fftN = (input, n, msgOffset = 0) => {
  let i = 0;
  let newInput = [...input];

  while (i < n) {
    console.log(`working on iteration ${i}`)
    newInput = fft(newInput, msgOffset);
    i++;
  }


  return newInput;

}

readFile(`16.in`, '')
  .then(data => {
    let numbers = data.map(n => Number(n));
    let messageOffset = Number(numbers.slice(0, 7).join(''));
    numbers10000 = [];
    for (let i = 0; i < 10000; i++) {
      numbers10000.push(...numbers);
    }

    console.log(fftN(numbers10000, 100, messageOffset).slice(messageOffset, messageOffset + 8));

  });

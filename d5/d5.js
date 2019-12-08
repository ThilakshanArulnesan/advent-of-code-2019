//Part 2
const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

const sum = (a, b) => {
  return a + b;
}
const mult = (a, b) => {
  return a * b;
}

const performUpdate = (arr, p1, p2, p3, cb, instructions) => {
  let param1 = instructions[2] === 0 ? arr[p1] : p1;
  let param2 = instructions[3] === 0 ? arr[p2] : p2;

  arr[p3] = cb(param1, param2);
}

const getCode = num => {
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(num % 10);
    num = Math.floor(num / 10);
  }
  return arr;
}


const analyze = (codes, input = 1) => {
  let incr = 4;
  for (i = 0; i < codes.length; i += incr) {
    let instructions = getCode(codes[i]);
    let opCode = instructions[1] * 10 + instructions[0];

    if (opCode === 99) break;


    if (opCode === 1) {
      let term1 = codes[i + 1];
      let term2 = codes[i + 2];
      let pos = codes[i + 3];

      performUpdate(codes, term1, term2, pos, sum, instructions);
      incr = 4;
    } else if (opCode === 2) {
      let term1 = codes[i + 1];
      let term2 = codes[i + 2];
      let pos = codes[i + 3];

      performUpdate(codes, term1, term2, pos, mult, instructions);
      incr = 4;
    } else if (opCode === 3) {
      instructions[2] = 1;
      instructions[3] = 1;
      let pos = codes[i + 1];
      performUpdate(codes, input, 0, pos, sum, instructions);
      incr = 2;
    } else if (opCode === 4) {
      incr = 2;
      let pos = codes[i + 1];
      console.log("OUTPUT: ", codes[pos]);
    }
  }
};


readFile(`5.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));
    analyze(codes, 1);
  });


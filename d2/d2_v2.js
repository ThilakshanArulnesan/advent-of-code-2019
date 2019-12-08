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

const performUpdate = (arr, p1, p2, p3, cb) => {
  arr[p3] = cb(arr[p1], arr[p2]);
}

const analyze = (codes) => {
  for (i = 0; i < codes.length; i += 4) {
    if (codes[i] === 99) break;
    term1 = codes[i + 1];
    term2 = codes[i + 2];
    pos = codes[i + 3];

    if (codes[i] === 1) {
      performUpdate(codes, term1, term2, pos, sum);
    } else if (codes[i] === 2) {
      performUpdate(codes, term1, term2, pos, mult);
    }
  }
};


readFile(`2.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));
    analyze(codes);
  });


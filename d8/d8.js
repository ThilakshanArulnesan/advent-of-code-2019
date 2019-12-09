
const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

readFile(`8.txt`, '')
  .then(res => {
    // console.log(res);
    const SIZE_OF_PAGE = 150;
    let pages = [];
    for (let i = 0; i < res.length; i += SIZE_OF_PAGE) {
      pages.push(res.slice(i, i + SIZE_OF_PAGE));
    }

    let numZeroes = pages[0].reduce((prev, curr) => prev + (Number(curr) === 0 ? 1 : 0), 0);

    let numOnes = 0;
    let numTwos = 0;

    for (let page of pages) {
      let zeroes = page.reduce((prev, curr) => prev + (Number(curr) === 0 ? 1 : 0), 0);


      if (zeroes < numZeroes) {
        numZeroes = zeroes;
        numOnes = page.reduce((prev, curr) => prev + (Number(curr) === 1 ? 1 : 0), 0);
        numTwos = page.reduce((prev, curr) => prev + (Number(curr) === 2 ? 1 : 0), 0);
      }
    }
    console.log(numOnes * numTwos);
  });


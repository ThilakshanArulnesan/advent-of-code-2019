//The output of this script is used as in canvasDraw.js to produce the image

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
    let finalImage = [];

    for (i = 0; i < SIZE_OF_PAGE; i++) {
      for (let page of pages) {
        if (Number(page[i]) !== 2) {
          finalImage.push(Number(page[i]));
          break;
        }
      }
    }


    for (let i = 0; i < SIZE_OF_PAGE; i += 25) {
      console.log(finalImage.slice(i, i + 25)); //Logs result to display
    }
  });


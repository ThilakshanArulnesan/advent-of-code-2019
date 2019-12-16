/*
Note the solution to d16 is only solvable quickly if the message offset > 75% of the input length. This will then ensure that all numbers before the offset are multiplied by 0, and all numbers after (and the number itself) are multiplied by 1. Without this assumption the problem takes much longer to compute.
*/
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
const fft = (input, msgOffset = 0) => {
  let out = new Array(msgOffset).fill(0);
  let appendArr = [];

  let prev = 0; //prev stores the value of the last digit, which is the sum of all the digits after it (and including it) in the previous iteration. We can use this value to calculate the next term (working from the end of the array backward)

  //EX [... 1 2 3 4] => [... x x x 4] => [... x x 7 4] => [... x 9 7 4] => [... 0 9 7 4]
  //      i = N-1    =>     i=N-2     =>     i=N-3     =>      i=N-4    =>  i=N-5
  for (let i = input.length - 1; i >= msgOffset; i--) { //Loop backwards
    prev += input[i];
    appendArr.push(prev % 10); //Remainder 10 to get the last digit. Always positive b/c initial input digits are always positive
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

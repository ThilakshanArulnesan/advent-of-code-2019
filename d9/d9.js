//Part 1 and 2 use the same code for this problem.
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

const lt = (a, b) => {
  return a < b ? 1 : 0;
}

const eq = (a, b) => {
  return a === b ? 1 : 0;
}

const performUpdate = (arr, p1, p2, p3, cb) => {
  arr[p3] = cb(p1, p2);
}

const getCode = num => {
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(num % 10);
    num = Math.floor(num / 10);
  }
  return arr;
}
let pointers = [0, 0, 0, 0, 0]; //Need as many machines running
let relativeOffset = [0, 0, 0, 0, 0]; //Need as many machines running

const analyze = (codes, input, machineNum = 0) => {
  let incr = 4;
  let start = pointers[machineNum];
  let offset = relativeOffset[machineNum];

  for (i = start; i < codes.length; i += incr) {
    pointers[machineNum] = i;
    let instructions = getCode(codes[i]);
    let opCode = instructions[1] * 10 + instructions[0];

    let term1 = codes[i + 1] || 0;
    let term2 = codes[i + 2] || 0;
    let pos = codes[i + 3] || 0;

    if (instructions[2] === 0 && opCode !== 3) {
      term1 = codes[term1] || 0;
    } else if (instructions[2] === 2 && opCode !== 3) {
      term1 = codes[term1 + offset] || 0;
    }

    if (instructions[3] === 0) {
      term2 = codes[term2] || 0;
    } else if (instructions[3] === 2) {
      term2 = codes[term2 + offset] || 0;
    }

    if (instructions[4] === 2) { //The third parameter must be able to accept instruction mode 2 (relative positioning)
      pos = pos + offset;
    }

    if (opCode === 99) {
      return null;
    }

    switch (opCode) {
      case 1: {
        performUpdate(codes, term1, term2, pos, sum);
        incr = 4;
        break;
      }

      case 2: {
        performUpdate(codes, term1, term2, pos, mult);
        incr = 4;
        break;
      }

      case 3: {
        if (input.length >= 1) {
          if (instructions[2] === 2) {
            codes[term1 + offset] = input.shift();
          } else {
            codes[term1] = input.shift();
          }
          incr = 2;
        } else {
          return null;
        }

        break;
      }

      case 4: {
        incr = 2;
        pointers[machineNum] = i + 2; //Store the location of where to restart the machine when it is used again
        console.log(term1);
        break;
      }
      case 5: {
        if (term1 !== 0) {
          i = term2;
          incr = 0;
        } else {
          incr = 3;
        }
        break;
      }

      case 6: {

        if (term1 === 0) {
          i = term2;
          incr = 0;
        } else {
          incr = 3;
        }
        break;
      }
      case 7: {
        performUpdate(codes, term1, term2, pos, lt);
        incr = 4;
        break;
      }
      case 8: {
        performUpdate(codes, term1, term2, pos, eq);
        incr = 4;
        break;
      }
      case 9: {
        relativeOffset[machineNum] = offset + term1;
        offset = offset + term1;
        incr = 2;
      }
    }
  }
};


//Note making the machines objects each with their own pointers & version of the code could simplify the code below
readFile(`9.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));
    analyze(codes, [2], 0);
  });
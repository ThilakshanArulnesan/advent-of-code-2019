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

const lt = (a, b) => {
  return a < b ? 1 : 0;
}

const eq = (a, b) => {
  return a === b ? 1 : 0;
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
let pointers = [0, 0, 0, 0, 0];

const analyze = (codes, input, machineNum = 0) => {
  let incr = 4;
  let start = pointers[machineNum]
  for (i = start; i < codes.length; i += incr) {
    pointers[machineNum] = i;
    let instructions = getCode(codes[i]);
    let opCode = instructions[1] * 10 + instructions[0];

    if (opCode === 99) {
      return null;
    }

    switch (opCode) {
      case 1: {
        let term1 = codes[i + 1];
        let term2 = codes[i + 2];
        let pos = codes[i + 3];

        performUpdate(codes, term1, term2, pos, sum, instructions);
        incr = 4;
        break;
      }

      case 2: {
        let term1 = codes[i + 1];
        let term2 = codes[i + 2];
        let pos = codes[i + 3];

        performUpdate(codes, term1, term2, pos, mult, instructions);
        incr = 4;
        break;
      }

      case 3: {
        instructions[2] = 1;
        instructions[3] = 1;
        let pos = codes[i + 1];
        if (input.length >= 1) {
          performUpdate(codes, input.shift(), 0, pos, sum, instructions);
          incr = 2;
        } else {
          return null;
        }

        break;
      }

      case 4: {
        incr = 2;
        let pos = codes[i + 1];
        pointers[machineNum] = i + 2; //Store the location of where to restart the machine when it is used again
        return codes[pos];
        break;
      }
      case 5: {
        let term1 = codes[i + 1];
        let term2 = codes[i + 2];
        if (instructions[2] === 0) {
          term1 = codes[term1];
        }
        if (instructions[3] === 0) {
          term2 = codes[term2];
        }
        if (term1 !== 0) {
          i = term2;
          incr = 0;
        } else {
          incr = 3;
        }
        break;
      }

      case 6: {
        let term1 = codes[i + 1];
        let term2 = codes[i + 2];
        if (instructions[2] === 0) {
          term1 = codes[term1];
        }
        if (instructions[3] === 0) {
          term2 = codes[term2];
        }

        if (term1 === 0) {
          i = term2;
          incr = 0;
        } else {
          incr = 3;
        }
        break;
      }
      case 7: {
        let term1 = codes[i + 1];
        let term2 = codes[i + 2];
        let pos = codes[i + 3];

        performUpdate(codes, term1, term2, pos, lt, instructions);
        incr = 4;
        break;
      }
      case 8: {
        let term1 = codes[i + 1];
        let term2 = codes[i + 2];
        let pos = codes[i + 3];

        performUpdate(codes, term1, term2, pos, eq, instructions);
        incr = 4;
        break;
      }
    }
    // console.log(codes);
  }
};

//Gets an array of all permutations of a given array of numbers
const getPermutations = nums => {
  let arr = [];
  if (nums.length === 1) {
    return [nums];
  }

  for (let num of nums) {
    getPermutations(nums.filter(n => n !== num)).forEach((perm) => {
      arr.push([num, ...perm])
    });
  }
  return arr;
}

//Note making the machines objects each with their own pointers & version of the code could simplify the code below
readFile(`7.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));

    //ITERATE OVER 5! = 120 CODES
    const permutations = getPermutations([5, 6, 7, 8, 9]);
    let thrusterSignals = [];
    for (let permutation of permutations) {

      //Reset the machines
      let codesA = [...codes];
      let codesB = [...codes];
      let codesC = [...codes];
      let codesD = [...codes];
      let codesE = [...codes];
      pointers = [0, 0, 0, 0, 0];

      //First iteration uses phase (permutation)
      let ampA = analyze(codesA, [permutation[0], 0], 0);
      let ampB = analyze(codesB, [permutation[1], ampA], 1);
      let ampC = analyze(codesC, [permutation[2], ampB], 2);
      let ampD = analyze(codesD, [permutation[3], ampC], 3);
      let ampE = analyze(codesE, [permutation[4], ampD], 4);
      let thrust = ampE;

      while (true) {
        //Cycle through using previous output as new input
        ampA = analyze(codesA, [thrust], 0);
        ampB = analyze(codesB, [ampA], 1);
        ampC = analyze(codesC, [ampB], 2);
        ampD = analyze(codesD, [ampC], 3);
        ampE = analyze(codesE, [ampD], 4);

        if (ampE === null || ampA === null || ampB === null || ampC === null || ampD === null) {
          break;
        } else {
          thrust = ampE;
        }
      }
      thrusterSignals.push(thrust);
    }

    let sortedSignals = thrusterSignals.sort((a, b) => b - a);
    console.log(sortedSignals[0]);
  });


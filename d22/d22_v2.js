//I had come up with my own versions of the 'reverse operations' to each shuffle (i.e. if asked for the card at position 2019, my algorithm was able to compute which number mapped to it from the set [0..n]). However I did not come up with a way to go from one iteration of this algorithm (which was very fast) to N iterations where N was an extremely large number (O(N) is not fast enough).

//Credit to u/etotheipi1 from reddit (https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/fbnifwk/) for a walkthrough of how to solve.

//The idea is to come up with a linear equation of the form f(x) = Ax + B [x = 2020]for the one entire reverse shuffle for our given input (i.e see my comment in line 1). Then we simply compose this function N times (i.e. f(f(...f(x))) ).  There is a pattern to this composition involving a geometric sum, which simplifies the work nicely. The final solution involves performing a calculation using the results of f(x) which is roughly O(log(N) where N is the number of shuffles).

const fs = require('fs');
const mod = (n, m) => {
  return ((n % m) + m) % m;
}

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.split(splitToken));
    });
  })
};

const transform = (instruction) => {
  if (instruction.trim() === 'deal into new stack') {
    return { type: 0, payload: 0 };
  }

  if (instruction.search(/cut/ig) !== -1) {
    return { type: 1, payload: Number(instruction.split(' ')[1]) };
  }

  if (instruction.search(/deal with increment/ig) !== -1) {
    return { type: 2, payload: Number(instruction.split('increment ')[1]) };
  }

  return { type: -1, payload: -1 }

}

const reverseOrder = (numCards, target) => {
  return numCards - 1 - target;
}

const cutN = (numCards, n, target) => {
  // if (n < 0) {
  //   n += numCards;
  // }
  return (target + n + numCards) % numCards;
}

const modinv = (a, m) => {
  // validate inputs
  [a, m] = [Number(a), Number(m)];
  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN // invalid input
  }
  a = (a % m + m) % m; //forces positive
  if (!a || m < 2) {
    return NaN;// invalid input
  }
  // find the gcd
  const s = [];
  let b = m;

  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }

  if (a !== 1) {
    //gcd(a,m) === 1 iff there exists a multiplicative inverse
    return NaN // inverse does not exists
  }
  // find the inverse
  let x = 1;
  let y = 0;
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
  }
  return (y % m + m) % m;
}

const dealWithIncrement = (numCards, incr, target) => {

  return modinv(incr, numCards) * target % numCards;
  let cycle = target % incr;//3

  let cardsDone = 0;

  let numExtra = numCards % incr; //3

  let rem = 0;

  let cardsPerCycle = Math.floor(numCards / incr);
  // for (let i = 0; i < cycle; i++) {
  while (rem !== cycle) {
    //Add cards for the full cycle
    cardsDone += cardsPerCycle;
    //The first few cycles may have extra cards
    if (rem < numExtra) {
      cardsDone += 1;
    }
    rem = (rem + (incr - (numCards % incr))) % incr;
    // rem = (rem + (incr - numCards ) % incr;
  }
  return cardsDone + Math.floor(target / incr);

  // return modinv(N, D) * i % D
}

// [ 0, 9, 8, 7, 6, 5, 4, 3, 2, 1 ] // incr 9
readFile(`22.in`, '\n')
  .then(async (instructions) => {
    //Approach: find where cards 2020 gets mapped to if the num cards is X
    // const NUM_CARDS = 10007;
    // let X = 2604;
    // const NUM_SHUFFLES = 1;

    const NUM_CARDS = 119315717514047;
    let X = 2020;
    const NUM_SHUFFLES = 101741582076661;

    const reverseOperations = (instructions, initialTarget) => {
      let newValue = initialTarget;
      instructions.forEach(instruction => {
        switch (instruction.type) {
          case 0: {
            newValue = reverseOrder(NUM_CARDS, newValue);
            break;
          }
          case 1: {
            newValue = cutN(NUM_CARDS, instruction.payload, newValue);
            break;
          }
          case 2: {
            newValue = dealWithIncrement(NUM_CARDS, instruction.payload, newValue);
            break;
          }
          default: {
            console.log('error')
            break;
          }
        }
      });
      return newValue;
    }
    // const NUM_CARDS = 10;
    instructions = instructions.map(transform).reverse();

    // for (let j = 0; j < 101741582076661; j++) {
    // targetPos = j;
    let Y = reverseOperations(instructions, X);
    let Z = reverseOperations(instructions, Y);

    //A = (Y-Z) * modinv(X-Y+D, D) % D
    const A = mod((Y - Z) * modinv(X - Y, NUM_CARDS), NUM_CARDS);
    // B = (Y-A*X) % D
    const B = mod((Y - A * X), NUM_CARDS);

    console.log(Y);
    console.log(Z);
    console.log('A:', A)
    console.log('B:', B)

    //print((pow(A, n, D)*X + (pow(A, n, D)-1) * modinv(A-1, D) * B) % D)

    const modExp = (a, b, n) => {
      a = a % n; //start mod n
      let result = 1;
      let x = a;

      while (b > 0) {
        let leastSignificantBit = b % 2; //0 or 1. Divides evenly or not. Only triggers first time and last time.
        b = Math.floor(b / 2);
        // b = b >> 1;

        if (leastSignificantBit === 1) {
          result = result * x;
          result = result % n;
        }

        x = x * x;
        x = x % n;
      }
      return result;
    };



    console.log(mod((modExp(A, NUM_SHUFFLES, NUM_CARDS) * X + (modExp(A, NUM_SHUFFLES, NUM_CARDS) - 1) * modinv(A - 1, NUM_CARDS) * B), NUM_CARDS));


    //82580230562965 too high

    //59203893852588 too low
    //36735486951082 too low
  });




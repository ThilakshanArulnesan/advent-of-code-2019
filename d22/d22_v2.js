//I had come up with my own versions of the 'reverse operations' to each shuffle (i.e. if asked for the card at position 2019, my algorithm was able to compute which number mapped to it from the set [0..n]). However I did not come up with a way to go from one iteration of this algorithm (which was very fast) to N iterations where N was an extremely large number (O(N) is not fast enough).

//Credit to u/etotheipi1 from reddit (https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/fbnifwk/) for a walkthrough of how to solve.

//The idea is to come up with a linear equation of the form f(x) = Ax + B [x = 2020]for the one entire reverse shuffle for our given input (i.e see my comment in line 1). Then we simply compose this function N times (i.e. f(f(...f(x))) ).  There is a pattern to this composition involving a geometric sum, which simplifies the work nicely. The final solution involves performing a calculation using the results of f(x) which is roughly O(log(N) where N is the number of shuffles).

//One last note is that the solution only works if all numbers are converted to BigInt() in javascript, otherwise there is overflow errror!

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
  return numCards - 1n - target;
}

const cutN = (numCards, n, target) => {
  return (target + n + numCards) % numCards;
}

const modinv = (a, m) => {
  // validate inputs
  [a, m] = [BigInt(a), BigInt(m)];

  a = (a % m + m) % m; //forces positive
  if (!a || m < 2n) {
    return NaN;// invalid input
  }
  // find the gcd
  const s = [];
  let b = m;

  while (b) {
    [a, b] = [b, a % b];
    s.push({ a, b });
  }

  if (a !== 1n) {
    console.log("nanning")
    //gcd(a,m) === 1 iff there exists a multiplicative inverse
    return NaN // inverse does not exists
  }
  // find the inverse
  let x = 1n;
  let y = 0n;
  for (let j = s.length - 2; j >= 0; --j) {
    let i = BigInt(j);
    [x, y] = [y, x - y * BigInt((s[i].a / s[i].b))];
  }
  return BigInt((y % m + m) % m);
}

const dealWithIncrement = (numCards, incr, target) => {
  let cycle = target % incr;//3

  let cardsDone = 0n;

  let numExtra = numCards % incr; //3

  let rem = 0n;

  let cardsPerCycle = (numCards / incr);
  // for (let i = 0; i < cycle; i++) {
  while (rem !== cycle) {
    //Add cards for the full cycle
    cardsDone += cardsPerCycle;
    //The first few cycles may have extra cards
    if (rem < numExtra) {
      cardsDone += 1n;
    }
    rem = (rem + (incr - (numCards % incr))) % incr;
    // rem = (rem + (incr - numCards ) % incr;
  }
  return cardsDone + (target / incr);


  //ALTERNATE APPROACH (I came up with the above approach. But u/etotheipi1 mentioned the one below which is conceptually simpler using modular arithmetic). Both my approach and the approach below yield the correct answer.
  //The idea here is to take the position we're interested (initially 2020) divide it by our increment size (in the modular 'ring', which will inform us which number will map to 2020 after performing this shuffle shuffling).
  // return modinv(incr, numCards) * target % numCards; //Performing 'modular division' by multiplying by inverse

}

// [ 0, 9, 8, 7, 6, 5, 4, 3, 2, 1 ] // incr 9
readFile(`22.in`, '\n')
  .then(async (instructions) => {
    //Approach: find where cards 2020 gets mapped to if the num cards is X

    //Test case (should give 2019):
    // const NUM_CARDS = 10007n;
    // let X = 2604n;
    // const NUM_SHUFFLES = 1n;

    //Given problem:
    const NUM_CARDS = 119315717514047n;
    let X = 2020n; //Target position
    const NUM_SHUFFLES = 101741582076661n;

    const reverseOperations = (instructions, initialTarget) => {
      let newValue = initialTarget;
      instructions.forEach(instruction => {
        switch (instruction.type) {
          case 0: {
            newValue = reverseOrder(NUM_CARDS, newValue);
            break;
          }
          case 1: {
            newValue = cutN(NUM_CARDS, BigInt(instruction.payload), newValue);
            break;
          }
          case 2: {
            newValue = dealWithIncrement(NUM_CARDS, BigInt(instruction.payload), newValue);
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

    //print((pow(A, n, D)*X + (pow(A, n, D)-1) * modinv(A-1, D) * B) % D)

    let modExp = function(a, b, n) {
      a = a % n;
      var result = 1n;
      var x = a;
      while (b > 0) {
        var leastSignificantBit = b % 2n;
        b = b / 2n;
        if (leastSignificantBit == 1n) {
          result = result * x;
          result = result % n;
        }
        x = x * x;
        x = x % n;
      }
      return result;
    };


    let ans = mod(
      (
        modExp(BigInt(A), BigInt(NUM_SHUFFLES), BigInt(NUM_CARDS)) * BigInt(X)
        + (modExp(BigInt(A), BigInt(NUM_SHUFFLES), BigInt(NUM_CARDS)) - 1n)
        * BigInt(modinv(A - 1n, NUM_CARDS) * B)
      ), BigInt(NUM_CARDS));

    console.log(ans);    //79608410258462

  })
  .catch(err => console.log(err));




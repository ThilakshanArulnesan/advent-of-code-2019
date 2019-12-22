//Part 1 and 2 use the same code for this problem.
const fs = require('fs');


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

const reverseOrder = cards => {
  let newCards = [];
  for (let i = cards.length - 1; i >= 0; i--) {
    newCards.push(cards[i]);
  }
  return newCards;
}

const cutN = (cards, n) => {
  let newCards = [];
  newCards.push(...cards.slice(n), ...cards.slice(0, n));
  return newCards;
}

const dealWithIncrement = (cards, incr) => {
  let newCards = [];
  let pos = 0;
  cards.forEach(card => {
    newCards[pos] = card
    pos += incr;
    pos = pos % cards.length;
  });

  return newCards;

}



readFile(`22.in`, '\n')
  .then(async (instructions) => {

    const NUM_CARDS = 10007;

    instructions = instructions.map(transform);


    let cards = Array.from(Array(NUM_CARDS).keys());

    instructions.forEach(instruction => {
      switch (instruction.type) {
        case 0: {
          cards = reverseOrder(cards);
          break;
        }
        case 1: {
          cards = cutN(cards, instruction.payload);
          break;
        }
        case 2: {
          cards = dealWithIncrement(cards, instruction.payload);
          break;
        }
        default: {
          console.log('error')
          break;
        }
      }
    });
    console.log(cards.findIndex(card => card === 2019));
  });




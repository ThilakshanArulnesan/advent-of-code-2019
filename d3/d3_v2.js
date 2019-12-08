//Part 2
// Use solution from part 1, but change from a set to a map. We can map coordinates to length of wire used

const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    // console.log("READING");
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      // console.log(data.split('\n'));
      res(data.trim().split(splitToken));
    });
  })
};

let curPos = { x: 0, y: 0 }; //Tracks current position of wire
// const positionSet = new Set(); //Tracks locations of wire 1
let positionSet = {};
let lengthOfWire = 0;
const matches = []; //Stores where two wires overlap

const movePos = (move, add) => {
  let moveType = move[0];
  let numMoves = move.slice(1);

  for (let i = 0; i < numMoves; i++) {
    lengthOfWire++;
    if (moveType === 'L') {
      curPos.x--;
    }
    else if (moveType === 'R') {
      curPos.x++;
    }
    else if (moveType === 'U') {
      curPos.y++;
    }
    else if (moveType === 'D') {
      curPos.y--;
    } else {
      continue;
    }

    if (add) {
      if (!positionSet[`${curPos.x},${curPos.y}`]) {
        positionSet[`${curPos.x},${curPos.y}`] = lengthOfWire;
      }
    }
    else {
      if (positionSet[`${curPos.x},${curPos.y}`]) {
        console.log('Match found ', `${curPos.x},${curPos.y}. Score is ${lengthOfWire + positionSet[`${curPos.x},${curPos.y}`]}`)
        matches.push(lengthOfWire + positionSet[`${curPos.x},${curPos.y}`]);
      }
    }

  }
}

readFile(`3.txt`, '\n')
  .then(res => {
    let wire1Moves = res[0].split(',');
    let wire2Moves = res[1].split(',');

    wire1Moves.forEach(move => {
      movePos(move, true);
    }); //Add wire1 locations to the set

    curPos = { x: 0, y: 0 }; //reset curPos
    lengthOfWire = 0;

    wire2Moves.forEach(move => {
      movePos(move, false);
    }); //Add wire1 locations to the set

    console.log(matches.sort((a, b) => a - b)[0]);
  });


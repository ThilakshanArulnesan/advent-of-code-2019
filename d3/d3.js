// Create a set of locations where the first wire is, then traverse through the second wire 
// and check if the position overlaps with the first by checking the set. 
// For any matches, compute the Manhattan distance and store it. Finally sort and return the lowest distance.
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
const positionSet = new Set(); //Tracks locations of wire 1
const matches = []; //Stores where two wires overlap

const movePos = (move, add) => {
  let moveType = move[0];
  let numMoves = move.slice(1);

  for (let i = 0; i < numMoves; i++) {
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
      positionSet.add(`${curPos.x},${curPos.y}`);
    }
    else {
      if (positionSet.has(`${curPos.x},${curPos.y}`)) {
        console.log('Match found ', `${curPos.x},${curPos.y}. Score is ${Math.abs(curPos.x) + Math.abs(curPos.y)}`)
        matches.push(Math.abs(curPos.x) + Math.abs(curPos.y));
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
    wire2Moves.forEach(move => {
      movePos(move, false);
    }); //Add wire1 locations to the set

    console.log(matches.sort((a, b) => a - b)[0]);
  });


//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { IntCodeProgram } = require('./Intcode.js');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};



const writePos = (x, y) => {
  return `${x},${y}`;
}

const mod = (n, m) => {
  return ((n % m) + m) % m;
}

const getNextPos = (pos, clockwise) => {
  //If direc === 1 -> turn right (clockwise)
  //If direc === 0 -> turn left (counter clockwise)
  let newPos = { ...pos };
  if (clockwise) {
    newPos.facing = mod(pos.facing + 1, 4);  // 0 = Up, 1 = Left, 2 = Down, 3 = right
  } else {
    newPos.facing = mod(pos.facing - 1, 4);  // 0 = Up, 1 = Left, 2 = Down, 3 = right

  }


  switch (newPos.facing) {
    case 0: {
      newPos.y++;
      break;
    }
    case 1: {
      newPos.x--;
      break;
    }
    case 2: {
      newPos.y--;
      break;
    }
    case 3: {
      newPos.x++;
      break;
    }
  }

  return newPos;
}

//Note making the machines objects each with their own pointers & version of the code could simplify the code below
readFile(`11.txt`, ',')
  .then(res => {
    let codes = res.map(v => Number(v));
    let robot = new IntCodeProgram(codes, 0, 0); //initialze robot

    // let robot = new IntCodeProgram(codes, 0, 0); //initialze robot
    let output1 = robot.analyze([1]); //white panel
    let output2 = robot.analyze([1]); //white panel
    let tiles = {};
    // 0 = Up, 1 = Left, 2 = Down, 3 = right
    let pos = { x: 0, y: 0, facing: 0 };

    while (!isNaN(output1) && !isNaN(output2)) {
      tiles[writePos(pos.x, pos.y)] = output1; //color the tile
      // console.log(pos, output1)

      pos = getNextPos(pos, output2); //Move the robot
      // console.log(tiles); 
      let col = tiles[writePos(pos.x, pos.y)] ? tiles[writePos(pos.x, pos.y)] : 0; //grab the color
      // if (tiles[writePos(pos.x, pos.y)])
      //   console.log(`tile exists ${writePos(pos.x, pos.y)}`, tiles[writePos(pos.x, pos.y)]);
      output1 = robot.analyze([col]);
      output2 = robot.analyze([col]);
    }
    // console.log(tiles);
    // console.log(Object.keys(tiles).length);
    let locs = Object.keys(tiles).map(val => { return { x: Number(val.split(',')[0]), y: Number(val.split(',')[1]) } });
    console.log(locs);
    let minX = locs.reduce((p, c) => c.x <= p ? c.x : p, 0);
    let minY = locs.reduce((p, c) => c.y <= p ? c.y : p, 0);
    console.log(minX);
    console.log(minY);
    let adjustLocs = locs.map(val => { return { x: val.x - minX, y: val.y - minY } });

    let maxX = adjustLocs.reduce((p, c) => c.x >= p ? c.x : p, 0);
    let maxY = adjustLocs.reduce((p, c) => c.y >= p ? c.y : p, 0);
    console.log(adjustLocs)
    console.log(maxX, maxY)
    let arr = [];
    for (let i = 0; i <= maxX; i++) {
      arr[i] = [];
      for (let j = 0; j <= maxY; j++) {
        arr[i][j] = 2;
      }
    }

    adjustLocs.forEach((loc, i) => arr[loc.x][loc.y] = tiles[Object.keys(tiles)[i]]);

    console.log(arr);
    // let retS = '';
    // for (let tile in tiles) {
    //   console.log(tile, tiles[tile]);
    //   retS += `${tile}:${tiles[tile]}\n`;
    // }
    // fs.writeFile('./11_out.txt', retS, () => { });
  });


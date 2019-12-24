//Part 1 and 2 use the same code for this problem.
const fs = require('fs');
const { IntCodeProgram } = require('./Intcode_mod.js');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};

const startNetwork = readFile(`nic.in`, ',')
  .then(async (res) => {
    let nic = res.map(v => Number(v));
    let computer = [];
    let instructions = [];
    //initialize 50 computers
    for (let i = 0; i < 50; i++) {
      computer[i] = new IntCodeProgram([...nic], 0, 0);
      instructions[i] = [];
      instructions[i].push(i);
    }

    while (true) {

      for (let i = 0; i < 50; i++) {
        let packet = [];

        while (true) {
          let num = computer[i].analyze(instructions[i]);

          if (isNaN(num)) {
            break;
          }
          packet.push(Number(num));
          if (packet.length === 3) {
            if (packet[0] === 255) {
              return packet[2];
            }
            instructions[packet[0]].push(packet[1], packet[2]);
            packet.length = 0;
            packet = [];
          }
        }
      }

    }

  });
startNetwork.then(res => console.log(res));




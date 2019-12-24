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
    let idling = [];
    let instructions = [];

    let nat = [];
    let prevInst = NaN; //Tracks the previous instruction sent to computer 0 by NAT

    //initialize 50 computers
    for (let i = 0; i < 50; i++) {
      computer[i] = new IntCodeProgram([...nic], 0, 0);
      idling[i] = false; //All computers start w/o idling
      instructions[i] = [];
      instructions[i].push(i);
    }


    while (true) {
      for (let i = 0; i < 50; i++) {
        let packet = [];
        if (!idling[i]) {
          while (true) {

            let num = computer[i].analyze(instructions[i]);

            //Modified intcode will send NaN if it is idling (when no instructions have been sent to it in the last 100 checks)
            if (isNaN(num)) {
              idling[i] = true; //Mark the computer as idling
              break;
            }

            //Add the output of intcode
            packet.push(Number(num));
            if (packet.length === 3) {
              if (packet[0] === 255) {
                nat[0] = packet[1];
                nat[1] = packet[2];
              } else {
                instructions[packet[0]].push(packet[1], packet[2]);
                idling[packet[0]] = false;
              }
              packet.length = 0;
              packet = [];
            }
          }
        } else {
          //check if all are idle:
          let allIdling = idling.reduce((acc, cur) => cur && acc, true);
          if (allIdling) {
            if (nat[1] === prevInst) {
              return prevInst;
            }
            prevInst = nat[1];
            instructions[0].push(nat[0], nat[1]);
            idling[0] = false;
          }
        }

      }

    }

  });
startNetwork.then(res => console.log(res));




let { calculateFuelFromFile } = require('../d14/d14');
let { calculateMaxFuel } = require('../d14/d14_v2');

//Part 1
calculateFuelFromFile('./14.txt').then(res => console.log(res));
calculateMaxFuel('./14.txt').then(res => console.log(res));
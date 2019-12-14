
const { getOre, createReactions, readFile } = require('./d14');


const calculateMaxFuel = async (filename) => {
  let TOTAL_ORE = 1000000000000;
  res = await readFile(filename, '\n');
  let formula = createReactions(res);

  //Perform a binary search to find the best match
  let lo = 0;
  let hi = 1000000000000;
  while (lo <= hi) {
    let mid = Math.floor((hi + lo) / 2);
    let amntOfOre = getOre("FUEL", mid, formula, {});
    if (amntOfOre < TOTAL_ORE) {
      lo = mid + 1;
    } else if (amntOfOre > TOTAL_ORE) {
      hi = mid - 1;
    } else {
      return mid;
    }
  }

  return hi; //hi<low (passed each other). This is the best match using just less than 1 trillion ore
}


module.exports = { calculateMaxFuel, createReactions };


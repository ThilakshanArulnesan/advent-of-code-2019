
const fs = require('fs');

const readFile = (filename, splitToken) => {
  return new Promise((res, rej) => {
    fs.readFile(`./${filename}`, 'utf8', (err, data) => {
      if (err) throw err;
      res(data.trim().split(splitToken));
    });
  })
};


const createReactions = (lines) => {
  let retObj = {};
  lines.forEach(line => {

    let temp = line.split('=>'); //splits products and reactants

    //Splits all the reactants
    let reactantsAndCount = temp[0].trim().split(',').map(r => r.trim().split(' '));
    let productAndCount = temp[1].trim().split(' ');


    retObj[productAndCount[1].trim()] = {
      num: Number(productAndCount[0]),
      reactants: {}
    }

    reactantsAndCount.forEach(r => {
      retObj[productAndCount[1].trim()].reactants[r[1]] = Number(r[0]);
    })
  });

  return retObj;
}

const getOre = (product, amount, formula, excessMaterial) => {
  if (product === "ORE") {//base case
    return amount;
  }

  let reactants = formula[product].reactants;

  if (excessMaterial[product]) {
    if (amount <= excessMaterial[product]) {
      excessMaterial[product] -= amount;
      return 0;
    } else {
      amount -= excessMaterial[product];
      excessMaterial[product] = 0;
    }
  }

  let numReq = Math.ceil(amount / formula[product].num);
  let amntExcess = numReq * formula[product].num - amount;

  if (!excessMaterial[product]) {
    excessMaterial[product] = amntExcess;
  } else {
    excessMaterial[product] += amntExcess;
  }

  let totOre = 0;
  for (let reactant in reactants) {
    totOre += getOre(reactant, reactants[reactant] * numReq, formula, excessMaterial);
  }
  return totOre;
};

const calculateFuelFromFile = async (filename) => {

  res = await readFile(filename, '\n');
  let formula = createReactions(res);
  let amntOfOre = getOre("FUEL", 1, formula, {});

  return amntOfOre;
}

module.exports = { calculateFuelFromFile, createReactions, getOre, readFile };


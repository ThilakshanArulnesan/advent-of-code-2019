let expect = require('chai').expect;
let { calculateFuelFromFile, createReactions } = require('../d14/d14');
let { calculateMaxFuel } = require('../d14/d14_v2.js');


describe('createReactions', () => {
  let lines = ['10 ORE => 10 A',
    '1 ORE => 1 B',
    '7 A, 1 B => 1 FUEL']
  let reactions = createReactions(lines);

  it('should find the right number of equations', () => {
    expect(Object.keys(reactions).length).to.equal(3);
  });

  it('should read line 3', () => {
    expect(reactions['FUEL']).to.eql({
      num: 1,
      reactants: {
        'A': 7,
        'B': 1
      }
    });
  });

  it('should read line 2', () => {

    expect(reactions['B']).to.eql({
      num: 1,
      reactants: {
        'ORE': 1
      }
    });
  });

  it('should read line 1', () => {
    expect(reactions['A']).to.eql({
      num: 10,
      reactants: {
        'ORE': 10
      }
    });

  });

});

describe('calculateFuelFromFile', () => {
  it('should work with a basic example', async () => {
    val = await calculateFuelFromFile('./d14/ex0.txt');
    expect(val).to.equal(31);
  });
  it('should work with a simple example', async () => {
    val = await calculateFuelFromFile('./d14/ex1.txt');
    expect(val).to.equal(165);
  });
  it('should work recursively', async () => {
    val = await calculateFuelFromFile('./d14/ex2.txt');
    expect(val).to.equal(13312);
  });
  it('should handle more complex reactions', async () => {
    val = await calculateFuelFromFile('./d14/ex3.txt');
    expect(val).to.equal(180697);
  });
  it('should handle more large complex reactions', async () => {
    val = await calculateFuelFromFile('./d14/ex4.txt');
    expect(val).to.equal(2210736);
  });
});

describe('should find total fuel for a recursive example', () => {
  it('should work recursively', async () => {
    val = await calculateMaxFuel('./d14/ex2.txt');
    expect(val).to.equal(82892753);
  });
  it('should handle more complex reactions', async () => {
    val = await calculateMaxFuel('./d14/ex3.txt');
    expect(val).to.equal(5586022);
  });
  it('should handle more large complex reactions', async () => {
    val = await calculateMaxFuel('./d14/ex4.txt');
    expect(val).to.equal(460664);
  });
});
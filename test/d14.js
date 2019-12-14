let expect = require('chai').expect;
let { calculateFuelFromFile, createReactions } = require('../d14/d14');


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
      num: 1,
      reactants: {
        'ORE': 1
      }
    });

  });

});

describe('calculateFuelFromFile', () => {
  it('should work with a basic example', async () => {
    val = await calculateFuelFromFile('./d14/ex0.txt');
    console.log(val);
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
    expect(val).to.equal(180687);
  });
  it('should handle more large complex reactions', async () => {
    val = await calculateFuelFromFile('./d14/ex4.txt');
    expect(val).to.equal(2210736);
  });
});
/* 
--- Part Two ---
An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
How many different passwords within the range given in your puzzle input meet all of the criteria?
*/


const getDigits = num => {
  let arr = [];
  while (num > 0) {
    arr.push(num % 10);
    num = Math.floor(num / 10);
  }
  return arr.reverse();
}

const checkCriteria = digits => {
  let repeatFlag = false;
  let numRepeats = 1;//Count number of repeats

  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < digits[i - 1]) return false;//Early exit if numbers decrease left to right

    if (digits[i] === digits[i - 1]) { //Two numbers are the same
      numRepeats++;
    } else {
      if (numRepeats === 2) {//If the digit isn't the same, check if there were only 2 repeats
        repeatFlag = true; //If so its valid
      }
      numRepeats = 1;
    }
  }
  return numRepeats === 2 ? true : repeatFlag; //Check if the last two digits were the same OR if we found two repeats already
}

const countValid = (min, max) => {
  let count = 0;
  for (let i = min; i <= max; i++) {
    let digits = getDigits(i);
    if (checkCriteria(digits)) {
      count++;
    }
  }

  return count;
}


console.log(countValid(153517, 630395));
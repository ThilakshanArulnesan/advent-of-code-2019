/*
--- Day 4: Secure Container ---
You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?
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
  repeatFlag = false;
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < digits[i - 1]) return false;
    if (digits[i] === digits[i - 1]) repeatFlag = true;
  }
  return repeatFlag;
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
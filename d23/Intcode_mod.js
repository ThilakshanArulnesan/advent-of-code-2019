class IntCodeProgram {

  constructor(code, pointer, relativeOffset) {
    this.code = code;
    this.pointer = pointer;
    this.relativeOffset = relativeOffset;
    this.hangingInstructions = 0;
  }

  //Helpers:
  sum(a, b) {
    return a + b;
  }
  mult(a, b) {
    return a * b;
  }

  lt(a, b) {
    return a < b ? 1 : 0;
  }

  eq(a, b) {
    return a === b ? 1 : 0;
  }

  performUpdate(arr, p1, p2, p3, cb) {
    arr[p3] = cb(p1, p2);
  }

  getCode(num) {
    let arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push(num % 10);
      num = Math.floor(num / 10);
    }
    return arr;
  }


  analyze(input) {
    let incr = 4;
    let start = this.pointer;
    // console.log(start);
    let offset = this.relativeOffset;
    // console.log(this.code);

    for (let i = start; i < this.code.length; i += incr) {
      this.pointer = i;
      let instructions = this.getCode(this.code[i]);
      let opCode = instructions[1] * 10 + instructions[0];

      let term1 = this.code[i + 1] || 0;
      let term2 = this.code[i + 2] || 0;
      let pos = this.code[i + 3] || 0;

      if (instructions[2] === 0 && opCode !== 3) {
        term1 = this.code[term1] || 0;
      } else if (instructions[2] === 2 && opCode !== 3) {
        term1 = this.code[term1 + offset] || 0;
      }

      if (instructions[3] === 0) {
        term2 = this.code[term2] || 0;
      } else if (instructions[3] === 2) {
        term2 = this.code[term2 + offset] || 0;
      }

      if (instructions[4] === 2) { //The third parameter must be able to accept instruction mode 2 (relative positioning)
        pos = pos + offset;
      }

      if (opCode === 99) {
        return NaN;
      }

      switch (opCode) {
        case 1: {
          this.performUpdate(this.code, term1, term2, pos, this.sum);
          incr = 4;
          break;
        }

        case 2: {
          this.performUpdate(this.code, term1, term2, pos, this.mult);
          incr = 4;
          break;
        }

        case 3: {
          // console.log('I got this', input);
          if (input.length >= 1) {
            // console.log('received input', input[0]);
            if (instructions[2] === 2) {
              this.code[term1 + offset] = input.shift();
            } else {
              this.code[term1] = input.shift();
            }
            incr = 2;
          } else {
            this.hangingInstructions++;
            if (this.hangingInstructions > 100) {
              this.hangingInstructions = 0;
              return NaN;
            } else {
              //modified
              // console.log('neg1');
              // return NaN;
              if (instructions[2] === 2) {
                this.code[term1 + offset] = -1;
              } else {
                this.code[term1] = -1;
              }
              incr = 2;
            }
          }
          break;
        }

        case 4: {
          incr = 2;
          this.pointer = i + 2; //Store the location of where to restart the machine when it is used again
          // console.log(term1);
          // console.log("EXIT", this.pointer, this.relativeOffset);

          return term1;
          break;
        }
        case 5: {
          if (term1 !== 0) {
            i = term2;
            incr = 0;
          } else {
            incr = 3;
          }
          break;
        }

        case 6: {

          if (term1 === 0) {
            i = term2;
            incr = 0;
          } else {
            incr = 3;
          }
          break;
        }
        case 7: {
          this.performUpdate(this.code, term1, term2, pos, this.lt);
          incr = 4;
          break;
        }
        case 8: {
          this.performUpdate(this.code, term1, term2, pos, this.eq);
          incr = 4;
          break;
        }
        case 9: {
          this.relativeOffset = offset + term1;
          offset = offset + term1;
          incr = 2;
        }
      }
    }
  };

}

module.exports = { IntCodeProgram };

document.addEventListener('DOMContentLoaded', function(event) {
  //the event occurred

  let c = this.getElementById("myCanvas");
  let ctx = c.getContext("2d");

  //This array was generated by d11_v2.js  using the algorithm described in the problem statement
  //Note that it turns out the image is mirrored (use a mirror to view the code)
  let arr = [[2, 2, 2, 0, 0, 2],
  [2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1],
  [0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1],
  [2, 0, 0, 2, 2, 0]];
  console.log(arr);

  for (let i = 0; i <= 42; i++) {
    for (let j = 0; j <= 6; j++) {
      console.log(arr[i][j]);
      if (arr[i][j] === 0) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.rect(j * 10, i * 10, 10, 10);
        ctx.fill()
      } else if (arr[i][j] === 2) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(j * 10, i * 10, 10, 10);
        ctx.fill();
      } else {
        ctx.strokeStyle = "white";
      }

    }
  }
})

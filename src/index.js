require("./styles.css");

let sketch = function(p) {
  var cnv = p.createCanvas(GAME_WIDTH, GAME_HEIGHT);
  //test
  const GAME_WIDTH = 1920;
  const GAME_HEIGHT = 1080;
  const canvasRatio = GAME_WIDTH / GAME_HEIGHT;
  const cellSize = 20; //This should be a factor of GAME_WIDTH and GAME_HEIGHT. Assuming 1920 and 1080, 12, 15, 20, 24, 30, and 40 will all work
  const gridWidth = GAME_WIDTH / cellSize - 5;
  const gridHeight = GAME_HEIGHT / cellSize;
  let editMode = false;
  var sizeCoefficient = 1; //Ratio of the size of the screen to the GAME_WIDTH and GAME_HEIGHT. Updated when the screen changes size.

  let grid = [];
  let tempGrid = []; //grid we will use to store the values of the next iteration

  p.preload = function() {
    for (let x = 0; x < gridWidth; x++) {
      grid[x] = [];
      for (let y = 0; y < gridHeight; y++) {
        grid[x][y] = 0;
      }
    }

    for (let x = 0; x < gridWidth; x++) {
      tempGrid[x] = [];
      for (let y = 0; y < gridHeight; y++) {
        tempGrid[x][y] = 0;
      }
    }

    grid[1][1] = 1;
    grid[1][3] = 1;
    grid[2][2] = 1;
    grid[2][3] = 1;
    grid[3][2] = 1;
  };

  p.setup = function() {
    p.windowResized();
    p.noStroke();
  };

  p.draw = function() {
    p.background(200);
    let dt = p.deltaTime;
    p.push();
    p.scale(p.width / GAME_WIDTH);

    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if (grid[x][y] === 1) {
          p.fill(0);
          p.rect(cellSize * x, cellSize * y, cellSize, cellSize);
        }
      }
    }

    if (editMode === false) {
      p.frameRate(20);
      for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
          let cellNeighbors = p.numberOfNeighbors(
            grid,
            x,
            y,
            gridWidth,
            gridHeight
          );
          if (grid[x][y] === 1) {
            //cell is alive
            if (cellNeighbors < 2 || cellNeighbors > 3) {
              //cell dies
              tempGrid[x][y] = 0;
            } else {
              // cell lives
              tempGrid[x][y] = 1;
            }
          } else {
            //cell is currently dead
            if (cellNeighbors === 3) {
              //cell becomes alive
              tempGrid[x][y] = 1;
            } else {
              //cell stays dead
              tempGrid[x][y] = 0;
            }
          }
        }
      }

      for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
          grid[x][y] = tempGrid[x][y];
        }
      }
    } else if (editMode === "place") {
      p.frameRate(100);
      if (p.mouseIsPressed) {
        if (
          p.floor((p.mouseX * sizeCoefficient) / cellSize) < grid.length &&
          p.floor((p.mouseX * sizeCoefficient) / cellSize) >= 0 &&
          p.floor((p.mouseY * sizeCoefficient) / cellSize) < grid[0].length &&
          p.floor((p.mouseY * sizeCoefficient) / cellSize) >= 0
        ) {
          grid[p.floor((p.mouseX * sizeCoefficient) / cellSize)][
            p.floor((p.mouseY * sizeCoefficient) / cellSize)
          ] = 1;
        }
      }
    } else if (editMode === "delete") {
      p.frameRate(100);
      if (p.mouseIsPressed) {
        if (
          p.floor((p.mouseX * sizeCoefficient) / cellSize) < grid.length &&
          p.floor((p.mouseX * sizeCoefficient) / cellSize) >= 0 &&
          p.floor((p.mouseY * sizeCoefficient) / cellSize) < grid[0].length &&
          p.floor((p.mouseY * sizeCoefficient) / cellSize) >= 0
        ) {
          grid[p.floor((p.mouseX * sizeCoefficient) / cellSize)][
            p.floor((p.mouseY * sizeCoefficient) / cellSize)
          ] = 0;
        }
      }
    }

    p.pop();
  };

  p.numberOfNeighbors = function(grid, x, y, sizeX, sizeY) {
    let neighborCount = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!(i === 0 && j === 0)) {
          if (
            !(i === 0 && j === 0) &&
            x + i >= 0 &&
            x + i <= sizeX - 1 &&
            y + j >= 0 &&
            y + j <= sizeY - 1
          ) {
            if (grid[x + i][y + j] === 1) {
              neighborCount++;
            }
          }
        }
      }
    }
    return neighborCount;
  };

  p.keyTyped = function() {
    if (p.key === "p") {
      editMode = "place";
    } else if (p.key === "d") {
      editMode = "delete";
    } else if (p.key === "s") {
      editMode = false;
    }
  };

  //window resize handling
  p.windowResized = function() {
    let newWidth = p.windowWidth;
    let newHeight = p.windowHeight;
    let newRatio = newWidth / newHeight;

    if (newRatio >= canvasRatio) {
      //Width is bigger than wanted
      newWidth = newHeight * canvasRatio;
      p.resizeCanvas(newWidth, newHeight);
    } else if (newRatio < canvasRatio) {
      //Height is bigger than wanted
      newHeight = newWidth / canvasRatio;
      p.resizeCanvas(newWidth, newHeight);
    }
    sizeCoefficient = GAME_WIDTH / newWidth;
    var xPos = (p.windowWidth - newWidth) / 2;
    var yPos = (p.windowHeight - newHeight) / 2;
    cnv.position(xPos, yPos);
    p.background(200);
  };
};

let myp5 = new p5(sketch);

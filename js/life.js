// get the canvas to draw on
var canvasElem = document.getElementById("life");
var canvas = canvasElem.getContext('2d');
var generationTextElem = document.getElementById("generation-cnt");
var nextGenBtn;
var prevGenBtn;

var generation = 0;
var grids = [];

// draw particle function
function drawParticle(x, y, c, s) {
    canvas.fillStyle = c;
    canvas.fillRect(x*s, y*s, s, s);
}

//function to get random coordinate on grid
function randomCoord(minX, maxX, minY, maxY) {
    var rnd = Math.random();
    var ranX = (rnd * (maxX - minX)) + minX;
    rnd = Math.random();
    var ranY = (rnd * (maxY - minY)) + minY;

    // cast to int
    ranX = Math.round(ranX);
    ranY = Math.round(ranY);

    var coord = [ranX, ranY];
    return coord;
}

function drawGrid(grid) {
    //particles
    for (let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] == 1) {
                drawParticle(i, j, "red", particleSize);
            }
        }
    }
    //vertical lines
    for(let i = 0; i <= grid.length; i++) {
        canvas.beginPath();
        canvas.moveTo(i*particleSize,0);
        canvas.lineTo(i*particleSize, grid[0].length*particleSize);
        canvas.stroke();
        canvas.closePath();
    }
    //horizontal lines
    for(let i = 0; i <= grid[0].length; i++) {
        canvas.beginPath();
        canvas.moveTo(0, i*particleSize);
        canvas.lineTo(grid.length*particleSize, i*particleSize);
        canvas.stroke();
        canvas.closePath();
    }
}

// return neighbour count of coord
function neighbourCount(coord, grid) {
    var neighbourCnt = 0;
    var x = coord[0], y = coord[1];
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            if(!(i==0 && j==0)) {
                try {
                    if(grid[x+i][y+j] == 1)
                        neighbourCnt++;
                } catch (error) {
                    // no spot on grid
                }
            }
        }
    }

    return neighbourCnt;
}

// applies G.O.L rules each call
function update(grid, next) {
    // loop through grid
    var newGrid = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            // count neighbours
            var neighbourCnt = neighbourCount([i,j], grid);
            // live cell rules
            if(grid[i][j] == 1) {
                // under-population & over-population
                if(neighbourCnt < 2 || neighbourCnt > 3) {
                    newGrid[i][j] = 0;
                }
            } else {
                // dead cell rules
                // reproduction
                if(neighbourCnt == 3) {
                    newGrid[i][j] = 1;
                }
            }
        }
    }

    return newGrid;
}

// function to forward one generation
function nextGeneration() {
    canvas.clearRect(0, 0, screenSize, screenSize);
    grids.push(grid);
    grid = update(grid, true);
    generation++;
    generationTextElem.innerHTML = "Generation: " + (generation+1);
    drawGrid(grid);
}

// function to go back one generation
function prevGeneration() {
    if(generation > 0) {
        canvas.clearRect(0, 0, screenSize, screenSize);
        grid = grids.pop();
        generation--;
        generationTextElem.innerHTML = "Generation: " + (generation+1);
        drawGrid(grid);
    }
}

// print mouse location on click
function printMousePos(event, print) {
    let x = (event.clientX - canvasElem.getBoundingClientRect().left);
    let y = (event.clientY - canvasElem.getBoundingClientRect().top)
    if(print)
        console.log( x + ", " + y);
    return [x, y];
}

// edit grid
function editGrid(event) {
    generation = 0;
    generationTextElem.innerHTML = "Generation: " + (generation+1);
    grids = [];
    let mousePos = printMousePos(event,false);
    mousePos[0] /= particleSize;
    mousePos[1] /= particleSize;
    // conver coords to grid space
    mousePos[0] = Math.floor(mousePos[0])+1;
    mousePos[1] = Math.floor(mousePos[1])+1;
    grid[mousePos[0]-1][mousePos[1]-1] = !grid[mousePos[0]-1][mousePos[1]-1]
    canvas.clearRect(0, 0, screenSize, screenSize);
    drawGrid(grid);
}

const screenSize = 500;
const particleSize = 10;
const lineWidth = 1;

canvas.lineWidth = lineWidth;
canvas.strokeStyle = "rgba(0,0,0,0.25)";

// set the canvas size
canvasElem.style.width = screenSize;
canvasElem.style.height = screenSize;

var gridSize = screenSize/particleSize;

// grid that models screen
var grid = [];
for (let i = 0; i < gridSize; i++) {
    let row = [];
    for(let j = 0; j < gridSize; j++) {
        row.push(0);
    }
    grid.push(row);
}

grid[1][1] = 1;
grid[2][2] = 1;
grid[0][2] = 1;
grid[21][5] = 1;

var particles = [];
// make particles
/*for (let i = 0; i < 10; i++) {
    var coord = randomCoord(0, gridSize-1, 0, gridSize-1);
    particles.push(new Particle(coord[0], coord[1], "red"));
    // add to grid
    grid[coord[0]][coord[1]] = 1;
}*/
drawGrid(grid);
window.addEventListener("DOMContentLoaded", (event) => {
    nextGenBtn = document.getElementById("nextGeneration");
    nextGenBtn.addEventListener("click", nextGeneration);
    prevGenBtn = document.getElementById("prevGeneration");
    prevGenBtn.addEventListener("click", prevGeneration);
    canvasElem.addEventListener("click", editGrid);
});

//nextGeneration(canvas, grid);
//canvas.clearRect(0, 0, screenSize, screenSize);
//grid = update(grid);
//drawGrid(grid);
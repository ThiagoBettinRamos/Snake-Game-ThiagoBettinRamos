var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var score = 0;
var timer = 0;
var interval = null;
var count = 0;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

var apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function updateTime() {
    timer++;
    var minutes = Math.floor(timer / 60);
    var seconds = timer - minutes * 60;
    document.getElementById('time').innerText = 'Time: ' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

interval = setInterval(updateTime, 1000);

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    score = 0;
    updateScore();
    timer = 0;
    clearInterval(interval);
    interval = setInterval(updateTime, 1000);
}

function loop() {
    requestAnimationFrame(loop);
    if (++count < 5) {
        return;
    }

    count = 0;
    context.clearRect(0,0,canvas.width,canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0 || snake.y < 0 || snake.x >= canvas.width || snake.y >= canvas.height) {
        resetGame();
        return;
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid-1, grid-1);

    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1);  
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            updateScore();
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }
        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
                return;
            }
        }
    });
}

function changeDirection(dx, dy) {
    if ((snake.dx * dx) + (snake.dy * dy) !== 0) {
        return;
    }
    snake.dx = dx;
    snake.dy = dy;
}

document.addEventListener('keydown', function(e) {
    if (e.which === 37) {
        changeDirection(-grid, 0);
    }
    else if (e.which === 38) {
        changeDirection(0, -grid);
    }
    else if (e.which === 39) {
        changeDirection(grid, 0);
    }
    else if (e.which === 40) {
        changeDirection(0, grid);
    }
});

document.getElementById('btn-up').addEventListener('click', function() {
    changeDirection(0, -grid);
});
document.getElementById('btn-right').addEventListener('click', function() {
    changeDirection(grid, 0);
});
document.getElementById('btn-down').addEventListener('click', function() {
    changeDirection(0, grid);
});
document.getElementById('btn-left').addEventListener('click', function() {
    changeDirection(-grid, 0);
});


document.getElementById('audio-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const audio = document.getElementById('audio');
    audio.src = url;
    audio.onloadeddata = function() {
        audio.volume = 0.2; // set volume after audio is loaded
        audio.play(); // play audio after it's loaded
    };
});

requestAnimationFrame(loop);

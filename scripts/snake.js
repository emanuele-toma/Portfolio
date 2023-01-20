class Snake
{
    snake = [];
    map = null;

    columns = 0;
    rows = 0;

    element = null;

    up = false;
    down = false;
    right = true;
    left = false;

    gameover = false;
    win = false;
    score = 0;
    addSegment = false;

    food = {x: 0, y: 0, c: 'ò'};

    interval = null;

    constructor(element)
    {
        this.element = element;
    }

    onGameOver = null;

    Start()
    {
        this.up = false;
        this.down = false;
        this.right = true;
        this.left = false;

        this.gameover = false;
        this.win = false;
        this.score = 0;
        this.addSegment = false;

        this.element.innerHTML = '';
        this.setLineHeight('1');
        this.columns = this.getFitChars(this.element);
        this.rows = this.getFitLines(this.element);

        this.map = Array(this.rows).fill(null).map(() => Array(this.columns))

        var startX = Math.floor(this.columns / 2);
        var startY = Math.floor(this.rows / 2);

        if (startX < 3)
        {
            startX = 3;
        }

        this.snake = [];
        this.snake.push({x: startX    , y: startY, c: '@'});
        this.snake.push({x: startX - 1, y: startY, c: '#'});
        this.snake.push({x: startX - 2, y: startY, c: '#'});
        this.snake.push({x: startX - 3, y: startY, c: '#'});

        for (let i = 0; i < this.snake.length; i++)
        {
            this.map[this.snake[i].y][this.snake[i].x] = this.snake[i].c;
        }

        this.AddEventListeners();
        this.GenerateFood();
        this.AddWalls();
        this.Draw();

        this.interval = setInterval(() => {
            this.Move();
            this.Check();
            this.Draw();

            if (this.gameover)
            {
                clearInterval(this.interval);
                this.setLineHeight('');
                
                if (this.win)
                    this.element.innerHTML = "Congratulations! You won!\n";
                else
                    this.element.innerHTML = "Game Over\n";

                var highscore = localStorage.getItem('snake_highscore');
                var previousScore = highscore;
                if (highscore == null || highscore < this.score)
                {
                    localStorage.setItem('snake_highscore', this.score);
                    this.element.innerHTML += "\nNew highscore!";
                    this.element.innerHTML += "\nPrevious highscore: " + previousScore;
                } else
                {
                    this.element.innerHTML += "\nHighscore: " + localStorage.getItem('snake_highscore');
                }

                this.element.innerHTML += "\nCurrent score: " + this.score;
                this.element.innerHTML += "\n\nInsert coin to continue...";
                this.element.innerHTML += "\nJust kidding, type 'snake' to play again\n";
                this.element.innerHTML += "\nOr type anything else to exit...\n";

                if (this.onGameOver != null && typeof this.onGameOver == 'function')
                {
                    this.onGameOver();
                    this.onGameOver = null;
                }
            }
        }, this.calcSpeed(this.columns * this.rows));
    }

    AddWalls()
    {
        for (let i = 0; i < this.rows; i++)
        {
            this.map[i][0] = '*';
            this.map[i][this.columns - 1] = '*';
        }

        for (let i = 0; i < this.columns; i++)
        {
            this.map[0][i] = '*';
            this.map[this.rows - 1][i] = '*';
        }
    }

    Draw()
    {
        this.element.innerHTML = '';
        for (let i = 0; i < this.rows; i++)
        {
            for (let j = 0; j < this.columns; j++)
            {
                if (this.map[i][j] == null)
                {
                    this.element.innerHTML += ' ';
                }
                else
                {
                    this.element.innerHTML += this.map[i][j];
                }
            }
            this.element.innerHTML += '\n';
        }
    }

    Check()
    {

        if (this.snake[0].x == 0 || this.snake[0].x == this.columns - 1 || this.snake[0].y == 0 || this.snake[0].y == this.rows - 1)
        {
            this.gameover = true;
        }

        for (let i = 1; i < this.snake.length; i++)
        {
            if (this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y)
            {
                this.gameover = true;
            }
        }

        if (this.gameover)
        {
            return;
        }

        if (this.snake[0].x == this.food.x && this.snake[0].y == this.food.y)
        {
            this.score++;
            this.GenerateFood();
            this.addSegment = true;
        }

        if (this.snake.length == this.columns * this.rows - 2)
        {
            this.gameover = true;
            this.win = true;
        }
    }

    Move()
    {
        if (this.addSegment)
        {
            this.addSegment = false;
        }
        else
        {
            this.map[this.snake[this.snake.length - 1].y][this.snake[this.snake.length - 1].x] = null;
            this.snake.pop();
        }

        if (this.up)
        {
            this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y - 1, c: '#'});
        }
        else if (this.down)
        {
            this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y + 1, c: '#'});
        }
        else if (this.left)
        {
            this.snake.unshift({x: this.snake[0].x - 1, y: this.snake[0].y, c: '#'});
        }
        else if (this.right)
        {
            this.snake.unshift({x: this.snake[0].x + 1, y: this.snake[0].y, c: '#'});
        }

        this.snake[0].c = '@';
        for (let i = 1; i < this.snake.length; i++)
        {
            this.snake[i].c = '#';
        }

        this.map[this.snake[0].y][this.snake[0].x] = this.snake[0].c;
        for (let i = 1; i < this.snake.length; i++)
        {
            this.map[this.snake[i].y][this.snake[i].x] = this.snake[i].c;
        }
    }

    Up()
    {
        if (this.down)
            return;

        this.up = true;
        this.down = false;
        this.right = false;
        this.left = false;
    }

    Down()
    {
        if (this.up)
            return;

        this.up = false;
        this.down = true;
        this.right = false;
        this.left = false;
    }

    Left()
    {
        if (this.right)
            return;

        this.up = false;
        this.down = false;
        this.right = false;
        this.left = true;
    }

    Right()
    {
        if (this.left)
            return;

        this.up = false;
        this.down = false;
        this.right = true;
        this.left = false;
    }

    GenerateFood()
    {        
        var randX = 0;
        var randY = 0;

        var isSnake = false;
        var isWall = false;

        do
        {
            randX = Math.floor(Math.random() * (this.columns - 2)) + 1;
            randY = Math.floor(Math.random() * (this.rows - 2)) + 1;

            isSnake = this.snake.some((segment) => segment.x == randX && segment.y == randY);
            isWall = this.map[randY][randX] == '*';

        } while (isSnake || isWall);

        this.food = {x: randX, y: randY, c: 'ò'};
        this.map[randY][randX] = this.food.c;
    }

    AddEventListeners()
    {
        document.addEventListener('keydown', (e) =>
        {
            if (e.key == 'ArrowUp')
                this.Up();
            else if (e.key == 'ArrowDown')
                this.Down();
            else if (e.key == 'ArrowLeft')
                this.Left();
            else if (e.key == 'ArrowRight')
                this.Right();
        });
    }


    getFitChars() {
        var width = parseInt(this.element.offsetWidth) - 
                parseInt(window.getComputedStyle(this.element).paddingLeft) -  
                parseInt(window.getComputedStyle(this.element).borderLeftWidth) - 
                parseInt(window.getComputedStyle(this.element).marginLeft);
    
        var font = window.getComputedStyle(this.element).font;
    
    
        var span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.font = font;
        span.style.wordBreak = 'break-all';
        span.style.visibility = 'hidden';
        span.style.width = width + 'px';
        document.body.appendChild(span);
    
        span.innerHTML = 'a';
        var height = span.offsetHeight;
    
        while (true) {
            span.innerHTML += 'a';
            if (span.offsetHeight > height) {
                break;
            }
        }
    
        var fitChars = span.innerHTML.length - 1;
        document.body.removeChild(span);
    
        return fitChars;
    }
    
    getFitLines() {
        var clone = this.element.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.width = this.element.offsetWidth + 'px';
        document.body.appendChild(clone);
    
        clone.innerHTML = '\n';
        var height = clone.offsetHeight;
    
        while (true) {
            clone.innerHTML += '\n';
            if (clone.scrollHeight > height) {
                break;
            }
        }
    
        var fitLines = clone.innerHTML.length - 1;
        document.body.removeChild(clone);
    
        return fitLines;
    }

    setLineHeight(x) {
        this.element.style.lineHeight = x;

        if (x == '') {
            this.element.style.fontSize = '';
            return;
        }

        var fontSize = parseInt(window.getComputedStyle(this.element).fontSize);
        this.element.style.fontSize = (parseInt(fontSize) * 2) + 'px';
    }

    calcSpeed(x)
    {
        const max = 250;
        var min = 50;

        min = max - min;

        const k = 500;
        return max - min/(1 + k / x)
    }
}
function randomNumber(range) {
    var number = Math.floor((Math.random() * range));
    return number;
}

// Enemies our player must avoid
var Enemy = function() {
    this.lanes = [61, 144, 310, 393];
    this.pickLane = randomNumber(4);
    this.x = -90;
    this.y = this.lanes[this.pickLane];
    this.speed = 50;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Player = function() {
    //block width (x) & height (y) used to
    //calculate move distance from start position
    this.xBlock = 101;
    this.yBlock = 83;
    //Player starting position
    this.x = this.xBlock * 3;
    this.y = 476;
    this.sprite = 'images/char-boy.png';
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function() {
    checkCollisions();
}

//Change keyboard input into player movement
Player.prototype.handleInput = function(direction) {
    if(direction === 'left' && this.x > 0) {
        this.x -= this.xBlock;
    } else if (direction === 'right' && this.x < 606) {
        this.x  += this.xBlock;
    } else if (direction === 'up' && this.y > 62) {
        this.y  -= this.yBlock;
    } else if (direction === 'down' && this.y <= 466) {
        this.y += this.yBlock;
    } else {
        return false;
    }
    //console.log('Player: X= ' + this.x + ' Y= ' + this.y);
}

//Create Gem object
var Gem = function() {
    //Randomly pick row
    this.pickRow = randomNumber(6);
    this.row = [0, 101, 202, 303, 404, 505];
    this.x = this.row[this.pickRow];
    //Randomly pick column
    this.pickColumn = randomNumber(6);
    this.column = [61, 144, 227, 310, 393, 476];
    this.y = this.column[this.pickColumn];
    //Randomly pick gem color
    this.pickGem = randomNumber(3);
    this.gem = [
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png'
    ];
    this.sprite = this.gem[this.pickGem];
};

// Draw the gem on the screen, required method for game
Gem.prototype.render = function() {
    //Need to offset the draw coordinates due to scaling down of image
    //Keeping this.x and this.y untouched to allow for ease of collision detection
    ctx.drawImage(Resources.get(this.sprite), this.x + 25, this.y + 55, 51, 86);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//Initialize allEnemies array
var allEnemies = [];

function createEnemies(){
    //Create new enemy
    var enemy = new Enemy();
    var enemyTotal = 20;
    //Add enemy to allEnemies array
    allEnemies.push(enemy);
    //Remove the first enemy created when enemyTotal is
    //reached to allow random placement of new enemy.
    if(allEnemies.length === enemyTotal + 1){
        allEnemies.shift();
    }
}

//Create enemies at 2second intervals
var spawnInterval = setInterval(createEnemies, 2000);

//Initialize player
var player = new Player();

//Initialize gem
var gem = new Gem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Checks for player/bug and player/gem intersections and resets player or activates gem power.
function checkCollisions() {
    if(allEnemies.length >= 1) {
        allEnemies.forEach(function(enemy) {
            //Check location of all enemies against player location
            //reset player if collision
            if(player.y === enemy.y && player.x < (enemy.x + 80)) {
                if(player.x > (enemy.x - 80)){
                    player.x = 303;
                    player.y = 476;
                };
            }
        })
    }
    if(gem !== undefined) {
        if(gem.x === player.x && gem.y === player.y) {
            if(gem.pickGem === 0){
                //Blue gem slows all current enemies and
                //changes sprite to blue image
                allEnemies.forEach(function(enemy) {
                    enemy.speed = 20;
                    enemy.sprite = 'images/blue-bug.png';
                })
                gem = new Gem();
            } else if(gem.pickGem === 1) {
                //Green gem teleports player to safe spot
                player.x = 303;
                player.y = 227;
                gem = new Gem();
            } else {
                //Orange gem destroys all enemies by
                //clearing allEnemies array
                allEnemies = [];
                gem = new Gem();
            }
        }
    }
}



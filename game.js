/* ===================== game.js ===================== */

let config;

fetch('config.json')
  .then(response => response.json())
  .then(data => {
    config = data;
    
    // Optionally set frog image
    const frogElem = document.getElementById('frog');
    if (config.frogImageUrl) {
      frogElem.style.backgroundImage = `url('${config.frogImageUrl}')`;
    }

    // Optionally set background image from config
    const gameContainer = document.getElementById('gameContainer');
    if (config.backgroundImage) {
      gameContainer.style.backgroundImage = `url('${config.backgroundImage}')`;
    }

    // Initialize the game once config is loaded
    FroggerGame.init();
  })
  .catch(err => console.error('Error loading configuration:', err));

const FroggerGame = {
  /* ----------------------------------------------
   *         Game State Variables & DOM
   * ---------------------------------------------- */
  frogX: 0,
  frogY: 0,
  obstacles: [],
  gameOver: false,

  // DOM elements
  frog: document.getElementById('frog'),
  gameContainer: document.getElementById('gameContainer'),
  winMessage: document.getElementById('winMessage'),
  loseMessage: document.getElementById('loseMessage'),

  /* ----------------------------------------------
   *                INIT METHOD
   * ---------------------------------------------- */
  init() {
    // Game is not over at start
    this.gameOver = false;

    // Position frog near bottom center
    this.centerFrogNearBottom();

    // 1) Set up WASD (or arrow key) controls
    document.addEventListener('keydown', (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          this.moveFrog(0, -config.frogStep);
          event.preventDefault();
          break;
        case 's':
          this.moveFrog(0, config.frogStep);
          event.preventDefault();
          break;
        case 'a':
          this.moveFrog(-config.frogStep, 0);
          event.preventDefault();
          break;
        case 'd':
          this.moveFrog(config.frogStep, 0);
          event.preventDefault();
          break;
      }
    });

    // 2) Set up on-screen arrow controls (if buttons exist in your HTML)
    const arrowUpBtn = document.getElementById('arrowUp');
    const arrowDownBtn = document.getElementById('arrowDown');
    const arrowLeftBtn = document.getElementById('arrowLeft');
    const arrowRightBtn = document.getElementById('arrowRight');

    // If those buttons exist, attach click listeners
    if (arrowUpBtn) {
      arrowUpBtn.addEventListener('click', () => {
        this.moveFrog(0, -config.frogStep);
      });
    }
    if (arrowDownBtn) {
      arrowDownBtn.addEventListener('click', () => {
        this.moveFrog(0, config.frogStep);
      });
    }
    if (arrowLeftBtn) {
      arrowLeftBtn.addEventListener('click', () => {
        this.moveFrog(-config.frogStep, 0);
      });
    }
    if (arrowRightBtn) {
      arrowRightBtn.addEventListener('click', () => {
        this.moveFrog(config.frogStep, 0);
      });
    }

    // 3) Start obstacle spawn/move intervals
    this.spawnInterval = setInterval(() => this.createObstacle(), config.obstacleSpawnInterval);
    this.moveInterval = setInterval(() => this.moveObstacles(), 30);
  },

  /* ----------------------------------------------
   *       CENTER THE FROG NEAR THE BOTTOM
   * ---------------------------------------------- */
  centerFrogNearBottom() {
    const containerWidth = this.gameContainer.clientWidth;
    const containerHeight = this.gameContainer.clientHeight;
    const frogWidth = this.frog.offsetWidth;
    const frogHeight = this.frog.offsetHeight;

    // Center horizontally, 20px from bottom
    this.frogX = (containerWidth - frogWidth) / 2;
    this.frogY = containerHeight - frogHeight - 20;

    this.frog.style.left = this.frogX + 'px';
    this.frog.style.top = this.frogY + 'px';
  },

  /* ----------------------------------------------
   *             MOVE THE FROG
   * ---------------------------------------------- */
  moveFrog(dx, dy) {
    const containerWidth = this.gameContainer.clientWidth;
    const containerHeight = this.gameContainer.clientHeight;
    const frogWidth = this.frog.offsetWidth;
    const frogHeight = this.frog.offsetHeight;

    const newX = this.frogX + dx;
    const newY = this.frogY + dy;

    // Clamp to container
    this.frogX = Math.max(0, Math.min(newX, containerWidth - frogWidth));
    this.frogY = Math.max(0, Math.min(newY, containerHeight - frogHeight));
    this.frog.style.left = this.frogX + 'px';
    this.frog.style.top = this.frogY + 'px';

    // Win check
    if (this.frogY <= 10) {
      this.showWin();
    }
  },

  /* ----------------------------------------------
   *              CREATE AN OBSTACLE
   * ---------------------------------------------- */
  createObstacle() {
    // Limit obstacles
    if (this.obstacles.length >= config.maxObstacles) {
      return;
    }

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    // Choose random obstacle from config
    let selected;
    if (config.obstacles && config.obstacles.length) {
      selected = config.obstacles[Math.floor(Math.random() * config.obstacles.length)];
    } else {
      selected = { type: 'text', content: 'Default' };
    }

    // Set obstacle width
    obstacle.style.width = config.obstacleWidth + 'px';

    // Determine obstacle height
    let obstacleHeight;
    if (selected.type === 'text') {
      obstacle.textContent = selected.content;
      obstacle.style.backgroundColor = '#e74c3c';
      obstacle.style.color = '#fff';
      // Estimate text lines
      const lines = Math.ceil(selected.content.length / 15);
      obstacleHeight = lines * 26 + 10;
    } else {
      // Image obstacle
      obstacle.style.backgroundImage = `url('${selected.url}')`;
      obstacle.style.backgroundSize = 'cover';
      obstacle.style.backgroundPosition = 'center';
      obstacle.textContent = '';
      obstacleHeight = config.obstacleHeight;
    }
    obstacle.style.height = obstacleHeight + 'px';

    // Spawn top (just above container)
    const spawnTop = -obstacleHeight;
    obstacle.style.top = spawnTop + 'px';

    // 70% chance safe zone near frog's current X
    const enforceReservedGap = Math.random() > 0.3;
    const frogSafeGap = enforceReservedGap
      ? { left: this.frogX, right: this.frogX + this.frog.offsetWidth }
      : null;

    // Compute possible horizontal range
    const containerWidth = this.gameContainer.clientWidth;
    const maxLeft = containerWidth - config.obstacleWidth;

    let left = 0;
    let attempts = 0;
    let overlapping = false;

    // Helper
    const newRect = (testLeft) => ({
      left: testLeft,
      right: testLeft + config.obstacleWidth,
      top: spawnTop,
      bottom: spawnTop + obstacleHeight
    });

    do {
      left = Math.random() * maxLeft;
      overlapping = false;
      const testRect = newRect(left);

      // Check frog safe zone
      if (frogSafeGap) {
        if (testRect.left < frogSafeGap.right && testRect.right > frogSafeGap.left) {
          overlapping = true;
        }
      }

      // Overlap check with existing obstacles in spawn row
      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i];
        const obsTop = parseInt(obs.style.top, 10);
        if (obsTop <= spawnTop + obstacleHeight) {
          const obsLeft = parseInt(obs.style.left, 10);
          if (
            testRect.left < obsLeft + config.obstacleWidth &&
            testRect.right > obsLeft
          ) {
            overlapping = true;
            break;
          }
        }
      }
      attempts++;
    } while (overlapping && attempts < 10);

    obstacle.style.left = left + 'px';
    this.gameContainer.appendChild(obstacle);
    this.obstacles.push(obstacle);
  },

  /* ----------------------------------------------
   *           MOVE EXISTING OBSTACLES
   * ---------------------------------------------- */
  moveObstacles() {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      let currentY = parseInt(obstacle.style.top, 10);
      currentY += config.obstacleSpeed;
      obstacle.style.top = currentY + 'px';

      // Remove if off bottom
      if (currentY > this.gameContainer.clientHeight) {
        obstacle.remove();
        this.obstacles.splice(i, 1);
      }

      // Collision check
      if (!this.gameOver && this.frogY <= this.gameContainer.clientHeight) {
        if (this.checkCollision(this.frog, obstacle)) {
          this.showLose();
        }
      }
    }
  },

  /* ----------------------------------------------
   *             COLLISION CHECK
   * ---------------------------------------------- */
  checkCollision(frogElem, obstacleElem) {
    const frogRect = frogElem.getBoundingClientRect();
    const obstacleRect = obstacleElem.getBoundingClientRect();
    return !(
      frogRect.top > obstacleRect.bottom ||
      frogRect.bottom < obstacleRect.top ||
      frogRect.left > obstacleRect.right ||
      frogRect.right < obstacleRect.left
    );
  },

  /* ----------------------------------------------
   *                 SHOW WIN/LOSE
   * ---------------------------------------------- */
  showWin() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.winMessage.style.display = 'block';
    clearInterval(this.spawnInterval);
    clearInterval(this.moveInterval);
    setTimeout(() => this.resetGame(), 2000);
  },

  showLose() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.loseMessage.style.display = 'block';
    clearInterval(this.spawnInterval);
    clearInterval(this.moveInterval);
    setTimeout(() => this.resetGame(), 2000);
  },

  /* ----------------------------------------------
   *                   RESET GAME
   * ---------------------------------------------- */
  resetGame() {
    // Remove obstacles
    this.obstacles.forEach(ob => ob.remove());
    this.obstacles = [];
    this.winMessage.style.display = 'none';
    this.loseMessage.style.display = 'none';
    this.gameOver = false;

    // Re-center frog near bottom
    this.centerFrogNearBottom();

    // Restart intervals
    this.spawnInterval = setInterval(() => this.createObstacle(), config.obstacleSpawnInterval);
    this.moveInterval = setInterval(() => this.moveObstacles(), 30);
  }
};

// DOMContentLoaded (Optional if you want to ensure DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
  // The actual game init occurs after config.json is loaded above
});

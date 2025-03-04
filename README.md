# Frogger-Game
This is a Frogger style game  https://dga-research.github.io/Frogger-Game/

Change the parameters in Config file to change the game style
in the config.json  file

Here's how each parameter in your configuration affects gameplay:

frogImageUrl:
The frog will display the Iron Man image specified. This doesn't change gameplay mechanics but defines your character's visual theme.

obstacleWords:
These words ("alpha", "bravo", "charlie", "Delta") appear on obstacles. They add a bit of flavor but don't directly impact the challenge.

frogStep (50):
Each time you press an arrow key, the frog moves 50 pixels. This value governs how quickly your character can reposition. A higher value means faster, larger jumps, while a lower value would allow for more precise, smaller movements.

obstacleSpawnInterval (1000 ms):
Obstacles will spawn every second. A shorter interval means obstacles appear more frequently, increasing the challenge by giving the player less time to react between obstacles.

obstacleSpeed (9):
Obstacles move downward at a rate of 9 pixels per update. With a higher speed, obstacles cross the screen more quickly, demanding faster reflexes from the player.

maxObstacles (9):
Up to 9 obstacles can exist on screen at the same time. More obstacles create a busier playfield, making it harder to navigate through gaps.

gameWidth (500) and gameHeight (600):
These dimensions define the play area. They remain constant, so the challenge adjustments come from how obstacles and frog movement behave within this space.

initialFrogX (225) and initialFrogY (510):
The frog's starting position remains at the bottom center of the game area. This starting point doesn’t change the difficulty but sets the initial condition for the game.

obstacleHeight (40):
This value helps with collision detection and obstacle positioning. It stays constant in this configuration.

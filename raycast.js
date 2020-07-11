const TILE_SIZE = 32;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI / 180);

const WALL_STRIP_WIDTH = 30;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

class Map {
	constructor() {
		        this.grid = [
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
					[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
					[1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					[1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
				];
	}
	hasWallAt(x, y) {
		if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT)
		{
			return (true);
		}
		let mapGridIndexX = Math.floor(x / TILE_SIZE);
		let mapGridIndexY = Math.floor(y / TILE_SIZE);
		return (this.grid[mapGridIndexY][mapGridIndexX] != 0);
	}
	render() {
		for (let i = 0; i < MAP_NUM_ROWS; i++) {
			for (let j = 0; j < MAP_NUM_COLS; j++) {
				let tileX = j * TILE_SIZE;
				let tileY = i * TILE_SIZE;
				let tileColor = this.grid[i][j] == 1 ? "#222" : "#fff";
				stroke("#222");
				fill(tileColor);
				rect(tileX, tileY, TILE_SIZE, TILE_SIZE);
			}
		}
	}
}

class Player {
	constructor() {
		this.x = WINDOW_WIDTH / 2;
		this.y = WINDOW_HEIGHT / 2;
		this.radius = 3;
		this.turnDirection = 0; // -1 if left, +1 if right
		this.walkDirection = 0; // -1 if back, +1 if front
		this.rotationAngle = Math.PI / 2;
		this.moveSpeed = 2.0;
		this.rotationSpeed = 2 * (Math.PI / 180);
	}
	update() {
		this.rotationAngle += this.turnDirection * this.rotationSpeed;
		
		let moveStep = this.walkDirection * this.moveSpeed;
		let newPlayerX = this.x + moveStep * Math.cos(this.rotationAngle); 
		let newPlayerY = this.y + moveStep * Math.sin(this.rotationAngle); 
		if (!grid.hasWallAt(newPlayerX, newPlayerY)) {
			this.x = newPlayerX;
			this.y = newPlayerY;
		}
	}
	render() {
		noStroke();
		fill("red");
		circle(this.x, this.y, this.radius * 2);
		stroke("red");
		line(
			this.x,
			this.y,
			this.x + Math.cos(this.rotationAngle) * 30,
			this.y + Math.sin(this.rotationAngle) * 30
		);
	}
}

class Ray {
	constructor(rayAngle) {
		this.rayAngle = rayAngle;
	}
	render() {
		stroke("rgba(255, 0, 0, 0.3)");
		line(
			player.x, 
			player.y,
			player.x + Math.cos(this.rayAngle) * 30,
			player.y + Math.sin(this.rayAngle) * 30
		);
	}

}
var grid = new Map();
var player = new Player();
var rays = [];

function keyPressed() {
	if (keyCode == UP_ARROW) {
		player.walkDirection++;	
	} else if (keyCode == DOWN_ARROW) {
		player.walkDirection--;	
	} else if (keyCode == RIGHT_ARROW) {
		player.turnDirection++;
	} else if (keyCode == LEFT_ARROW) {
		player.turnDirection--;
	}
}

function keyReleased() {
	if (keyCode == UP_ARROW) {
		player.walkDirection = 0;
	} else if (keyCode == DOWN_ARROW) {
		player.walkDirection = 0;	
	} else if (keyCode == RIGHT_ARROW) {
		player.turnDirection = 0;
	} else if (keyCode == LEFT_ARROW) {
		player.turnDirection = 0;
	}
}

function castAllRays() {
	let columnId = 0;

	//start first ray subtracting half of the FOV
	let rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

	rays = [];

	//loop all columns casing the rays
	for (let i = 0; i < NUM_RAYS; i++)
	{
		let ray = new Ray(rayAngle);
		// ray.cast();
		rays.push(ray);

		rayAngle += FOV_ANGLE / NUM_RAYS;
	
		columnId++;
	}
}
function setup() {
	createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update () {
	player.update();
	castAllRays();
}

function draw() {
	update();

	grid.render();
	for (ray of rays) {
		ray.render();
	}
	player.render();
}


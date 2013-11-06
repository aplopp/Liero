define({
	canvasID: 'stage',
	FPS: 60,
	map: 'map1',
	stage: {
		ratio: 2,
	},
	physics: {
		gravity: 1, 
		groundFriction: 0,
		airFriction: 0
	},
	player: {
		bounce: .7,
		height: 30,
		width: 30,
		moveSpeed: .1
	},
	players: [
		{ 
			name: 'Joe', 
			color: '#249',
			height: 20,
			width: 20,
			x: 300,
			y: 120
		}
	],
	keyBindings: {
		left: 37,
		up: 38,
		right: 39,
		down: 40, 
		jump: 18, // option
	}	
});
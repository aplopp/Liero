define({
	canvasID: 'stage',
	/** frames/per second. */
	FPS: 60,
	map: 'map1',
	stage: {
		ratio: 2,
	},
	physics: {
		/** acceleration from gravity, in px/s */		
		gravity: 1000, 
		/** deceleration from groundFriction, in px/s */
		groundFriction: 0,
		/** deceleration from airFriction, in px/s */
		airFriction: 0
	},
	player: {
		bounce: .7, // energy maintained after bounce
		height: 30, // in px
		width: 30, // in px
		/** acceleration from player.moveLeft() or player.moveRight(), in px/s */
		moveSpeed: 10, 
		/** change in vY from player.jump() px/s */
		jumpPower: 100
	},
	players: [
		{ 
			model: {
				name: 'Joe', 
				color: '#249',
				height: 20,
				width: 20,
				x: 300,
				y: 120,
			}, 
			keyBindings: {
				left: 37,
				up: 38,
				right: 39,
				down: 40, 
				jump: 'alt', // option
				shoot: 32 // space				
			}

		},
		{ 
			model: {
				name: 'Sarah', 
				color: '#350',
				height: 30,
				width: 30,
				x: 330,
				y: 120,
			}, 
			keyBindings: {
				left: 65, //a
				up: 87, // w
				right: 68, //d
				down: 83,// s 
				jump: 88, // option
				shoot: [ 'command', 88 ] // x				
			}

		}		
	],
	keyBindings: {

	}	
});
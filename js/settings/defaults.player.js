define({
	weight: 100,
	hitsPlayer: false,
	x: 0,
	y: 200,
	vX: 0,
	vY: 0,
	height: 20,
	width: 20,
	model: {
		/** acceleration from player.moveLeft() or player.moveRight(), in px/s */
		moveSpeed: 10,
		/** change in vY from player.jump() px/s */
		jumpPower: 500,
		name: 'Default Name',
		color: '#333',
		totalHealth: 100,
		delayTilRespawn: 3000,
		digDepth: 4,
		rope: {
			launchSpeed: 1000,
			color: '#000',
			launchDistanceFromCenter: 10
		},
		weapons: [ 'gun' ]
	},
	physics: {
		acceleration: 0,
		bounce: .7,
		friction: .2,
		gravity: 1

	},
});
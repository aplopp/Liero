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
		jumpPower: 500
	},
	players: [
		{ 
			x: 0,
			y: 0,
			vX: 0,
			vY: 1000,
			model: {
				name: 'Joe', 
				color: '#249',
				height: 20,
				width: 20,
				weapons: [ 'machineGun', 'grenadeLauncher', 'gun' ]
			}, 
			keyBindings: {
				left: 37, // l
				up: 38, // u
				right: 39, // r
				down: 40, // d
				jump: [ 'command-r' ],
				shoot: [ 32 ], // space		
				prevWeapon: [ 37, 'shift-r' ],
				nextWeapon: [ 39, 'shift-r' ]
			}

		},
		{ 
			x: 0,
			y: 0,
			vX: 0,
			vY: 1000,			
			model: {
				name: 'Sarah',
				color: '#350',
				height: 30,
				width: 30,
				weapons: [ 'gun', 'grenadeLauncher', 'hugeGun']
			}, 
			keyBindings: {
				left: 65, //a
				up: 87, // w
				right: 68, //d
				down: 83,// s 
				jump: [ 'control-l' ],
				shoot: 9, // tab-l
				prevWeapon: [ 65, 'shift-l' ],
				nextWeapon: [ 68, 'shift-l' ]				
			}
		}		
	],
	weapons: {
		gun: {
			name: 'Gun', 
			reload: 2, // shots/s
			recoil: 10, // pixels/s
			speed: 600, // pixels/s
			projectile: 'bullet', 
			auto: false,
			color: '#249',
			length: 40,
			width: 2
		},
		hugeGun: {
			name: 'Gun', 
			reload: 2, // shots/s
			recoil: 10, // pixels/s
			speed: 600, // pixels/s
			projectile: 'flame', 
			auto: false,
			color: '#00f',
			length: 80,
			width: 10
		},
		grenadeLauncher: {
			name: 'Grenade Launcher', 
			reload: .5, // shots/s
			recoil: 30, // pixels/s
			speed: 1000, // pixels/s
			projectile: 'grenade',
			auto: false,
			color: '#0f0',
			length: 10, 
			width: 4		

		},
		machineGun: {
			name: 'Machine Gun', 
			reload: 100, // shots/s
			recoil: 1, // pixels/s
			speed: 1000, // pixels/s
			projectile: 'bullet',
			auto: true,
			color: '#000', 
			length: 20, 
			width: 3
		}
	}, 
	projectiles: {
		grenade: {
			color: '#cc0000',
			width: 4,
			height: 4
		},
		bullet: {
			color: '#000',
			width: 3,
			height: 3	
		},
		flame: {
			color: 'orange',
			width: 10,
			height: 10
		}
	},
	keyBindings: {

	}	
});
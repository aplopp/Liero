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
			model: {
				name: 'Joe', 
				color: '#249',
				height: 20,
				width: 20,
				weapons: [ 'grenadeLauncher', 'machineGun' ]
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
			model: {
				name: 'Sarah',
				color: '#350',
				height: 30,
				width: 30,
				weapons: [ 'gun', 'grenadeLauncher']
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
		grenadeLauncher: {
			name: 'Grenade Launcher', 
			reload: .5, // shots/s
			recoil: 30, // pixels/s
			speed: 100, // pixels/s
			projectile: 'grenade',
			auto: false,
			color: '#0f0',
			length: 10, 
			width: 4		

		},
		machineGun: {
			name: 'Machine Gun', 
			reload: 20, // shots/s
			recoil: 1, // pixels/s
			speed: 300, // pixels/s
			projectile: 'bullet',
			auto: true,
			color: '#000', 
			length: 20, 
			width: 3
		}
	}, 
	keyBindings: {

	}	
});
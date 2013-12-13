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
		/** deceleration from groundFriction, in decimal lost per frame */
		surfaceFriction: .01,
		/** deceleration from airFriction, in px/s */
		airFriction: 0
	},
	player: {
		height: 30, // in px
		width: 30, // in px
		/** acceleration from player.moveLeft() or player.moveRight(), in px/s */
		moveSpeed: 10, 
		/** change in vY from player.jump() px/s */
		jumpPower: 500,
		physics: {
			acceleration: 0,
			bounce: .7,
			friction: 0,
			gravity: 1
		}	
	},
	players: [
		{ 
			x: 100,
			y: 490,
			vX: 0,
			vY: 0,	

			model: {
				name: 'Joe', 
				color: '#249',
				height: 20,
				width: 20,
				weapons: [ 'rocketLauncher', 'shotgun', 'grenadeLauncher', 'machineGun', 'gun' ]
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
				weapons: [ 'machineGun', 'gun', 'grenadeLauncher', 'hugeGun']
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
			reload: 20, // shots/s
			recoil: 10, // pixels/s
			speed: 600, // pixels/s
			projectile: 'flame', 
			auto: true,
			color: '#00f',
			length: 80,
			width: 10
		},
		grenadeLauncher: {
			name: 'Grenade Launcher', 
			reload: .5, // shots/s
			recoil: 1000, // pixels/s
			speed: 800, // pixels/s
			projectile: 'grenade',
			auto: false,
			color: '#0f0',
			length: 10, 
			width: 4	

		},
		machineGun: {
			name: 'Machine Gun', 
			reload: 40, // shots/s
			recoil: 50, // pixels/s
			speed: 1000, // pixels/s
			scatter: 0, // max 90
			projectile: 'bullet',
			auto: true,
			color: '#000', 
			length: 20, 
			width: 3
		},
		rocketLauncher: {
			name: 'Rocket Launcher',
			reload: 2,
			recoil: 100,
			speed: 50,
			scatter: 0,
			projectile: 'rocket',
			auto: false,
			color: '#339',
			perShot: 1,
			length: 20, 
			width: 3
		},
		shotgun: {
			name: 'Shotgun',
			reload: 500,
			recoil: 200,
			speed: 900,
			speedVariability: 100,
			scatter: 20,
			projectile: function( weapon ){
				return {
					modifies: 'bullet',
					color: weapon.get('holdingPlayer').get('color'),
					onLaunch: function( projectile, weapon ){
						projectile.width = Math.abs( weapon.getHoldingPlayer().vX ) / 100;
						if (projectile.width < 1 ) projectile.width = 1;
						return projectile;
					}
				};
			},
			// projectile: {
			// 	modifies: 'bullet',
			// 	color: 'yellow'
			// },
			auto: false, 
			perShot: 1000,
			color: '#efefef',
			length: 10, 
			width: 4
		}
	}, 
	projectiles: {
		grenade: {
			model: {
				name: 'Grenade',
				color: '#cc0000',
				width: 15,
				delayToExplosion: 1000,
				delayToExplosionVariability: 0,
				explosion: 'big'
			}
		},
		rocket: {
			model: {
				name: 'Rocket',
				color: '#00cc00',
				width: 15,
				height: 30,
				delayToExplosion: 1000,
				delayToExplosionVariability: 0,
				explosion: 'big',
			},
			physics: {
				acceleration: 50,
				bounce: .4,
				friction: 0,
				gravity: 0
			}
 		},
		bullet: {
			model: {
				name: 'Bullet',
				color: '#000',
				width: 2,
				delayToExplosion: 1000,
				delayToExplosionVariability: 0, 
				explosion: 'small'
			},
			physics: {
				gravity: 1,
				bounce: 1.1
			}
		},
		flame: {
			model: {
				name: 'Flame',
				color: 'orange',
				width: 10,
				delayToExplosionVariability: 100, 
				explosion: 'special',
			}
		}
	},
	explosions: {
		special: {
			name: 'Special Explosion', 
			duration: 1200,
			animation: {
				colors: [
					{ position: 0, value: '#fff' },
					{ position: .2, value: '#00B1FF' },
					{ position: .4, value: '#00E1FF' },
					{ position: .7, value: '#cc0000' },
					{ position: .9, value: '#94FFE8' },
					{ position: 1, value: '#fff' }
				],
				radius: [
					{ position: 0, value: 25 },
					{ position: .5, value: 50 },
					{ position: .7, value: 5 },
					{ position: .8, value: 12 },
					{ position: 1, value: 1 }
				]
			},	
		},
		big: {
			name: 'Big Explosion',
			duration: 1000,
			animation: {
				colors: [
					{ position: 0, value: '#00B1F7' },
					{ position: .2, value: '#F7D200' },
					{ position: .4, value: '#F73A00' },
					{ position: .6, value: '#E80000' },
					{ position: 1, value: '#750000' }
				],
				radius: [
					{ position: 0, value: 15 },
					{ position: .5, value: 20 },
					{ position: .8, value: 15 },
					{ position: 1, value: 1 }
				]
			},				
		},
		medium: {
			name: 'Medium Explosion',
			duration: 1000,
			animation: {
				colors: [
					{ position: 0, value: '#00B1F7' },
					{ position: .2, value: '#F7D200' },
					{ position: .4, value: '#F73A00' },
					{ position: .6, value: '#E80000' },
					{ position: 1, value: '#750000' }
				],
				radius: [
					{ position: 0, value: 1 },
					{ position: .5, value: 20 },
					{ position: 1, value: 1 }
				]
			},				
		},
		small: {
			name: 'Small Explosion',
			duration: 1000,
			animation: {
				colors: [
					{ position: 0, value: '#00B1F7' },
					{ position: .2, value: '#F7D200' },
					{ position: .4, value: '#F73A00' },
					{ position: .6, value: '#E80000' },
					{ position: 1, value: '#750000' }
				],
				radius: [
					{ position: 0, value: 1 },
					{ position: .5, value: 20 },
					{ position: 1, value: 1 }
				]
			}			
		}		
	},
	keyBindings: {

	}	
});


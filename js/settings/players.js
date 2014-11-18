define([
	{
		x: 0,
		y: 480,
		vX: 0,
		vY: 0,
		height: 20,
		width: 20,
		model: {
			name: 'Joe',
			color: '#249',
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
			nextWeapon: [ 39, 'shift-r' ],
			launchNinjaRope: [ 'command-r', 188 ], // comma
			dig: [37,39] // l + r
		}
	},
	{
		x: 460,
		y: 460,
		vX: 0,
		vY: 0,
		height: 30,
		width: 30,
		model: {
			name: 'Sarah',
			color: '#350',
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
			nextWeapon: [ 68, 'shift-l' ],
			launchNinjaRope: [ 'control-l', 'shift-l' ], // comma
			dig: [65,68] // l + r
		}
	}
]);
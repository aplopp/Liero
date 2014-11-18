define({
	gun: {
		name: 'Gun',
		reload: 2, // shots/s
		recoil:  0, // pixels/s
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
		length: 20,
		width: 3
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
		speed: 200,
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
		auto: false,
		perShot: 1000,
		color: '#efefef',
		length: 10,
		width: 4
	}
});
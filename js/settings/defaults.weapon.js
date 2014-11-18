define({
	name: 'Unnamed Weapon (of doom)',
	reload: 100,
	recoil: 100,
	speed: 100,
	speedVariability: 100,
	scatter: 100,
	projectile: 'bullet',
	// projectile: function( weapon ){
	// 	return {
	// 		modifies: 'bullet',
	// 		color: weapon.get('holdingPlayer').get('color'),
	// 		onLaunch: function( projectile, weapon ){
	// 			projectile.width = Math.abs( weapon.getHoldingPlayer().vX ) / 100;
	// 			if (projectile.width < 1 ) projectile.width = 1;
	// 			return projectile;
	// 		}
	// 	};
	// },
	auto: false,
	perShot: 1000,
	color: '#efefef',
	length: 10,
	width: 4
});
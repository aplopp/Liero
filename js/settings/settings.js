define([
	'underscore',
	'settings/general',
	'settings/defaults.player',
	'settings/players',
	'settings/defaults.weapon',
	'settings/weapons',
	'settings/defaults.projectile',
	'settings/projectiles',
	'settings/defaults.explosion',
	'settings/explosions',
], function( _, general, dfPlayer, players, dfWeapon, weapons, dfProjectile, projectiles, dfExplosion, explosions ){
	var settings = {};
	settings.general = general;
	settings.players = _.map( players, function( player ){
		return _.extend( player, dfPlayer );
	});
	// settings.weapons = _.map( weapons, function( weapon ){
	// 	return _.extend( weapon, dfWeapon );
	// });
	// settings.projectiles = _.map( projectiles, function( projectile ){
	// 	return _.extend( projectile, dfProjectile );
	// });
	// settings.explosions = _.map( explosions, function( explosion ){
	// 	return _.extend( explosion, dfExplosion );
	// });
	return settings;
});
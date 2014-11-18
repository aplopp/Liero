define([
	'underscore',
	'backbone',
	'createjs',
	'models/weapon',
	'functions/color'
], function( _, Backbone, createjs, WeaponM, ColorFunctions ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var ProjectileM = Backbone.Model.extend({
		defaults: {
			// personal properties
			name: 'Default Projectile Name',
			color: '#666',
			width: 1,
			height: 1,
			perShot: 1, // how many per shot
			scatter: 0, // scatter, in degrees (max 90)
			aim: 0,
			sticky: {
				enabled: false,
				duration: 10000
			},  // sticks to objects when it collides with them? How long? Negates bounce.
			// how long in ms until it explodes
			delayToExplosion: 300,
			// the actual delay will be delayToExplosion +- a random number from 0 to explosionDelayVariability
			delayToExplosionVariability: 200,
			explosion: 'small',
			// function to modify behaviour at launch time
			onLaunch: function(projectile, weapon){
				return projectile;
			}
		},
		initialize: function(){
			var explosion = this.get( 'explosion');
			if ( _.isString( explosion ) ){
				var type = explosion;
				var explosion = settings.explosions[ explosion ];
				this.set( 'explosion', $.extend({ _type: type }, explosion ) );
			}
		}
	});
	return ProjectileM;
});
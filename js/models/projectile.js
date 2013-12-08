define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'models/weapon',
	'settings'
], function( _, Backbone, createjs, WeaponM, settings ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var ProjectileM = Backbone.Model.extend({
		defaults: {
			// personal properties
			color: '#666',
			height: 1,
			width: 1,
			perShot: 1, // how many per shot
			scatter: 0, // scatter, in degrees (max 90)
			bounce: .8, // energy retained after bounce (.8 = 80%)
			sticky: {
				enabled: false,
				duration: 10000
			},  // sticks to objects when it collides with them? How long? Negates bounce.
			// how long in ms until it explodes			
			delayToExplosion: 300, 
			// the actual delay will be delayToExplosion +- a random number from 0 to explosionDelayVariability			
			delayToExplosionVariability: 200,
			explosion: {
			}

		},	
		initialize: function(){
			
		}
	}); 
	return ProjectileM;
});
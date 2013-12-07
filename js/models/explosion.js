define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'settings'
], function( _, Backbone, createjs, settings ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var ExplosionM = Backbone.Model.extend({
		defaults: {
			duration: 500,
			colorStart: 'red',
			colorEnd: 'yellow',
			color: 'red',
			radius: 10,
			currentRadius: 0,
			particles: {
				amount: 0,
				type: 'particleType'
			},
			projectiles: {
				amount: 0,
				directional: true,
				scatter: 30
			}
		}
	}); 
	return ExplosionM;
});
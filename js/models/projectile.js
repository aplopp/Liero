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
			width: 1
		},	
	}); 
	return ProjectileM;
});
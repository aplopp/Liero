define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'models/weapon',
	'settings', 
	'functions/color'
], function( _, Backbone, createjs, WeaponM, settings, ColorFunctions ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var RopeEndM = Backbone.Model.extend({
		defaults: {
			// personal properties
			color: '#ff0',
			width: 10,
			height: 10
		},	
		initialize: function(){	
		}
	}); 
	return RopeEndM;
});
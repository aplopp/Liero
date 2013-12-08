define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'settings', 
	'functions/color'
], function( _, Backbone, createjs, settings, ColorFunctions ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var ExplosionM = Backbone.Model.extend({
		defaults: {
			duration: 1500,
			colors: [ '#00B8C2', '#0C1EE8', '#764AD4'],
			color: false,
			radius: 20,
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
		}, 
		initialize: function(){
			// convert color to an rgba array
			var colors = this.get( 'colors' );
			colors = _.map( colors, function( color ){
				if ( _.isString( color )){
					return ColorFunctions.getColorRgba( color );
				}
			});
			this.set( 'colors', colors );
			if ( _.isArray( colors ) ){
				this.set( 'color', colors[0] );
			}
		}
	}); 
	return ExplosionM;
});
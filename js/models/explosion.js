define([
	'underscore',
	'backbone',
	'createjs',
	'functions/color'
], function( _, Backbone, createjs, ColorFunctions ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var ExplosionM = Backbone.Model.extend({
		defaults: {
			duration: 1500,
			animation: {
				colors: [
					{ position: 0, value: ColorFunctions.getColorRgba( '#00B1F7' ) },
					{ position: .2, value: ColorFunctions.getColorRgba( '#F7D200' ) },
					{ position: .4, value: ColorFunctions.getColorRgba( '#F73A00' ) },
					{ position: .6, value: ColorFunctions.getColorRgba( '#E80000' ) },
					{ position: 1, value: ColorFunctions.getColorRgba( '#750000' ) }
				],
				radius: [
					{ position: 0, value: 1 },
					{ position: .5, value: 20 },
					{ position: 1, value: 1 }
				]
			},
			_color: false,
			_radius: false
		},
		initialize: function(){
			// set initial color
			this.set( '_color', this.get( 'animation' ).colors[ 0 ].value );

			// set initial radius
			this.set( '_radius', this.get( 'animation' ).radius[ 0 ].value );

		}
	});
	return ExplosionM;
});
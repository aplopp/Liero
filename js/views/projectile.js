define([
	'underscore',
	'jquery',
	'backbone',
	'createjs',
	'views/map-object',
	'functions/math',
	'functions/animations'
], function( _, $, Backbone, createjs, MapObjectV, mathFunctions, animations ){
	var ProjectileV = MapObjectV.extend({
		/** render the model to the canvas as a shape */
		render: function( changed ){
			if ( ! changed ){
				changed = this.model.attributes
			}
			// set up the shape
			if (
				_.has( changed, 'color' )
				|| _.has( changed, 'width' )
				|| _.has( changed, 'height' )
			){				// draw body
		 		this.shape.graphics
		 			.clear()
		 			// .beginFill( '#000' )
		 			// .drawRect( 0, 0, this.model.get( 'width'), this.model.get( 'height') )
		 			// .endFill()
		 			.beginFill( this.model.get( 'color' ) )
		 			.drawCircle(this.model.get( 'width')/2, this.model.get( 'width' )/2, this.model.get( 'width')/2 )
		 			.endFill()
		 	}
			
		 	return this.shape;
		}
	});
	return ProjectileV;
});
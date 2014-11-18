define([ 
	'underscore', 
	'jquery',	
	'backbone',
	'createjs', 
	'views/map-object'
], function( _, $, Backbone, createjs, MapObjectV ){
	var RopeEndV = MapObjectV.extend({
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
		 			.beginFill( this.model.get( 'color' ) )
		 			.drawCircle(this.model.get( 'width')/2, this.model.get( 'width' )/2, this.model.get( 'width')/2 )
		 			.endFill()
		 	}
		 	console.log( 'rope end rendered' );
		 	return this.shape; 
		}
	}); 
	return RopeEndV;
});
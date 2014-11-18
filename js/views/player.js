define([ 
	'underscore', 
	'jquery',	
	'backbone',
	'createjs', 
	'views/map-object',	
	'functions/math',
	'functions/animations'
], function( _, $, Backbone, createjs, MapObjectV, mathFunctions, animations ){
	var PlayerV = MapObjectV.extend({
		/** render the model to the canvas as a shape */
		render: function( changed ){
			if ( ! changed ){
				changed = this.model.attributes
			}
			// set up the shape
			if ( 
				_.has( changed, 'color' ) 
				|| _.has( changed, 'height' ) 
				|| _.has( changed, 'width' )  
				|| _.has( changed, 'facing' ) 
				|| _.has( changed, 'aim' )  
				|| _.has( changed, 'activeWeapon' ) 
			){				// draw body
		 		this.shape.graphics
		 			.clear()
		 			.beginFill( this.model.get( 'color' ) )
		 			.drawRect(0, 0, this.model.get( 'width' ), this.model.get( 'height') )
		 			.endFill();
		 		
		 		// draw weapon
		 		var activeWeapon = this.model.getActiveWeapon();
		 		var dir = this.model.get( 'facing' ) === 'left' ? -1 : 1
		 		var end = mathFunctions.getPointOnCircle(  this.model.get( 'width' )/2, this.model.get( 'height' )/2, activeWeapon.get('length'), dir * this.model.get( 'aim' ) );
		 		this.shape.graphics
		 			.moveTo( this.model.get( 'width')/2, this.model.get( 'height' )/2 )
		 			.beginStroke( activeWeapon.get( 'color' ) )
		 			.setStrokeStyle( activeWeapon.get( 'width' ) )
		 			.lineTo( end.x, end.y )

		 	}

		 	// handle the rope
		 	if ( _.has( changed, '_ropeIsLaunched')){
		 		this.shape.graphics
		 			.moveTo( this.model.get( 'width')/2, this.model.get( 'height' )/2 )
		 			.beginStroke( this.model.get( 'rope' ).get( 'coo') )
		 			.setStrokeStyle( activeWeapon.get( 'width' ) )
		 			.lineTo( end.x, end.y )
		 	}
	
		 	return this.shape; 
		}
	}); 
	return PlayerV;
});
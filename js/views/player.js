define([ 
	'underscore', 
	'jquery',	
	'backbone',
	'createjs', 
	'functions/math',
	'functions/animations'
], function( _, $, Backbone, createjs, mathFunctions, animations ){
	var PlayerV = Backbone.View.extend({
		shape: false,
		initialize: function(){
			this.shape = new createjs.Shape();
			this.listenTo( this.model, 'change', this.render ); 
		}, 
		/** render the model to the canvas as a shape */
		render: function( model ){
			if ( ! model ){
				model = {
					changed: this.model.attributes
				};
			}
			// set up the shape
			if ( 
				_.has( model.changed, 'color' ) 
				|| _.has( model.changed, 'height' ) 
				|| _.has( model.changed, 'width' )  
				|| _.has( model.changed, 'facing' ) 
				|| _.has( model.changed, 'aim' )  
			){
		 		this.shape.graphics
		 			.clear()
		 			.beginFill( this.model.get( 'color' ) )
		 			.drawRect(0, 0, this.model.get( 'width' ), this.model.get( 'height') )
		 			.endFill();
		 		
		 		var dir = this.model.get( 'facing' ) === 'left' ? -1 : 1
		 		var end = mathFunctions.getPointOnCircle(  this.model.get( 'width' )/2, this.model.get( 'height' )/2, this.model.get( 'width' )/1.3, dir * this.model.get( 'aim' ) );
		 		this.shape.graphics
		 			.moveTo( this.model.get( 'width')/2, this.model.get( 'height' )/2 )
		 			.beginStroke( '#fff' )
		 			.setStrokeStyle( 4 )
		 			.lineTo( end.x, end.y )

		 	}
		 	if ( _.has( model.changed, 'x') ){
			 	this.shape.x =  model.changed.x;
		 	}
		 	if ( _.has( model.changed, 'y') ){
			 	this.shape.y = model.changed.y; 
		 	}		
		 	return this.shape; 
		}
	}); 
	return PlayerV;
});
define([ 
	'underscore', 
	'jquery',	
	'backbone',
	'createjs', 
	'functions/math',
	'functions/animations'
], function( _, $, Backbone, createjs, mathFunctions, animations ){
	var ProjectileV = Backbone.View.extend({
		shape: false,
		initialize: function(){
			var that = this;
			this.shape = new createjs.Shape();
			this.listenTo( this.model, 'change', function(){
				that.render( that.model.changed );
			}); 
		}, 
		setPos: function( pos ){
		 	this.shape.x =  pos.x;
		 	this.shape.y = pos.y; 
		},
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
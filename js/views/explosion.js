define([ 
	'underscore', 
	'jquery',	
	'backbone',
	'createjs', 
	'functions/color'
], function( _, $, Backbone, createjs, ColorFunctions ){
	var ExplosionV = Backbone.View.extend({
		shape: false,
		initialize: function(){
			var that = this;
			this.shape = new createjs.Shape();
			this.listenTo( this.model, 'change', function(){
				that.render( that.model.changed );
			}); 
		}, 
		setPos: function( pos ){
		 	this.shape.x = pos.x;
		 	this.shape.y = pos.y; 
		},
		/** render the model to the canvas as a shape */
		render: function( changed ){
			if ( ! changed ){
				changed = this.model.attributes
			}
			// set up the shape
			if ( 
				_.has( changed, '_color' ) 
				|| _.has( changed, '_radius' )
			){			
				// draw
		 		this.shape.graphics
		 			.clear()
		 			.beginFill( ColorFunctions.getRgbaString( this.model.get( '_color' ) ) )
		 			.drawCircle(0, 0, this.model.get( '_radius' ))
		 			.endFill();
		 	}
	
		 	return this.shape; 
		}
	}); 
	return ExplosionV;
});
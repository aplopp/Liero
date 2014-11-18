define([
	'underscore',
	'backbone',
	'createjs'
], function( _, Backbone, createjs ){
	var MapObjectV = Backbone.View.extend({
		shape: false,
		initialize: function(){
			var that = this;
			this.shape = new createjs.Shape();
			this.listenTo( this.model, 'change', function(){
				that.render( that.model.changed );
			});
		},
		setPos: function( pos ){
			if ( _.has( pos, 'x' )){
		 		this.shape.x =  pos.x;
		 	}
		 	if ( _.has( pos, 'y' )){
		 		this.shape.y =  pos.y;
		 	}
		}
	})
	return MapObjectV;
});
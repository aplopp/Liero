define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'models/map-object'
], function( _, Backbone, createjs, MapObjectM ){
	var PlayerM = Backbone.Model.extend({
		defaults: {
			// personal properties
			color: '#666',
			facing: 'left',
			aim: 0, // -45 to 90
			moving: 0, // -1, 0, or 1	
			bounce: .8, 
			x: 0, 
			y: 0, 
			prevX: 0,
			prevY: 0	
		},
		initialize: function(){
		},		
		validate: function( attrs, options ){
			if( attrs.aim < 0 || attrs.aim > 135 ){
				return 'Outside accepted limits for range'; 
			}
		},
		moveLeft: function(){
			this.model.set( 'facing', 'left' );
			this.model.set( 'x', this.model.get( 'x' ) + 3 );
		},
		moveRight: function(){
			this.model.set( 'facing', 'right' );		
			this.model.set( 'x', this.model.get( 'x' ) - 3 );
		},
		aimUp: function(){
			this.model.set({ 'aim': this.model.get( 'aim' ) - 3 }, { validate: true });
		},
		aimDown: function(){
			this.model.set({ 'aim': this.model.get( 'aim' ) + 3 }, { validate: true });
		},
		jump: function(){

		}			
	}); 
	return PlayerM;
});
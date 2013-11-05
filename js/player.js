define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs',
	'models/player',
	'views/player',
	'models/map-object'
], function( settings, _, Backbone, createjs, PlayerM, PlayerV, MapObjectM ){
	var Player = function( playerSpec ){
		this.model = new PlayerM( playerSpec );
		this.view = new PlayerV({ model: this.model });;
		this.angle = 0;
		this.vX = -5;
		this.vY = 0;
		this.isSupported = false;

	}
	var p = Player.prototype;
	p.moveLeft = function(){
		this.model.set( 'facing', 'left' );
		this.model.set( 'x', this.model.get( 'x' ) + 3 );
	}
	p.moveRight = function(){
		this.model.set( 'facing', 'right' );		
		this.model.set( 'x', this.model.get( 'x' ) - 3 );
	}
	p.aimUp = function(){
		this.model.set({ 'aim': this.model.get( 'aim' ) - 3 }, { validate: true });
	}
	p.aimDown = function(){
		this.model.set({ 'aim': this.model.get( 'aim' ) + 3 }, { validate: true });
	}
	p.nextPosition = function(){
		this.model.set( 'prevX', this.model.get( 'x' ) );		
		this.model.set( 'prevY', this.model.get( 'y' ) );
		this.model.set( 'y', this.model.get( 'y' ) + this.vY );
		this.model.set( 'x', this.model.get( 'x' ) + this.vX );

		if ( ! this.isSupported ){
			this.vY += settings.physics.gravity; 
		} else if ( this.vX ){
			if ( this.vX < 1 ){
				this.vX = 0; 				
			}
			this.vX *= settings.physics.friction;			
		}
		this.vY *= ( 1 - settings.physics.airFriction );
		this.vX *= ( 1 - settings.physics.airFriction );
	}

	return Player;
});
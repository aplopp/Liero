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
		this.vX = 0; // velocity in px/s
		this.vY = 0; // velocity in px/s
		this.isSupported = false;
	}
	var p = Player.prototype;
	p.moveLeft = function(){
		this.model.set( 'facing', 'left' );
		this.vX -= settings.player.moveSpeed; 
	}
	p.moveRight = function(){
		this.model.set( 'facing', 'right' );		
		this.vX += settings.player.moveSpeed; 
	}
	p.aimUp = function(){
		this.model.set({ 'aim': this.model.get( 'aim' ) - 3 }, { validate: true });
	}
	p.aimDown = function(){
		this.model.set({ 'aim': this.model.get( 'aim' ) + 3 }, { validate: true });
	}
	p.jump = function(){
		this.vY -= settings.player.jumpPower; 
	}
	p.nextPosition = function(){
		this.model.set( 'y', this.model.get( 'y' ) + this.vY/settings.FPS );
		this.model.set( 'x', this.model.get( 'x' ) + this.vX/settings.FPS );

		if ( ! this.isSupported ){
			this.vY += settings.physics.gravity/settings.FPS; 
		} else if ( this.vX ){
			if ( this.vX < 1 ){
				this.vX = 0; 				
			}
			this.vX *= settings.physics.friction/settings.FPS;			
		}
		this.vY *= ( 1 - settings.physics.airFriction/settings.FPS );
		this.vX *= ( 1 - settings.physics.airFriction/settings.FPS );
	}

	return Player;
});
define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs',
	'models/player',
	'views/player',
	'models/map-object',
	'keys'
], function( settings, _, Backbone, createjs, PlayerM, PlayerV, MapObjectM, keys ){
	var id = 0; 
	var Player = function( playerSpec ){
		this.model = new PlayerM( playerSpec.model );
		this.view = new PlayerV({ model: this.model });;
		this.vX = 0; // velocity in px/s
		this.vY = 0; // velocity in px/s
		this.isSupported = false;
		
		_.each( playerSpec.keyBindings, function( keyCodes, action ){
			keys.setBinding( prefixActionName( action ), keyCodes );		
		}); 
		this.handleKeyPresses();
		id++; 
	}
	function prefixActionName( action ){
		return 'p'+id+'-' + action ;
	}
	var p = Player.prototype;
	p.handleKeyPresses = function(){
		var that = this;

		keys.on( prefixActionName( 'left' ), function(){
			that.moveLeft();
		});
		keys.on( prefixActionName( 'right' ), function(){
			that.moveRight();
		});
		keys.on( prefixActionName( 'up' ), function(){
			that.aimUp();
		});
		keys.on( prefixActionName( 'down' ), function(){
			that.aimDown();
		});

		keys.on( prefixActionName( 'jump' ), function(){
			that.jump();
		});
		keys.on( prefixActionName( 'shoot' ), function(){
			that.shoot();
		});
	}
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
	p._shooting = false; 
	p._stopShooting = false;
	p.shoot = function(){
		var that = this;
		clearTimeout( this._stopShooting ); // continue shooting
		if ( !this._shooting ){
			console.log( 'bang!');
			this._shooting = setInterval( function(){
				console.log( 'bang!');
			}, 500); 
		} 
		// set timeout, so if shooting stops before next frame, it will end.
		this._stopShooting = setTimeout( function(){
			clearInterval( that._shooting );
			that._shooting = false; 
		}, ( 1/settings.FPS ) * 1000 ); 		
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
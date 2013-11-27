define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs',
	'models/player',
	'views/player',
	'keys'
], function( settings, _, Backbone, createjs, PlayerM, PlayerV, keys ){
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
		this.id = id;
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

		keys.on( prefixActionName( 'jump:end' ), function(){
			that.jump();
		});
		keys.on( prefixActionName( 'shoot:start' ), function(){
			that.startShooting();
		});
		keys.on( prefixActionName( 'shoot:end' ), function(){
			that.endShooting();
		});
		keys.on( prefixActionName( 'prevWeapon:start' ), function(){
			that.switchWeapon( false );
		});
		keys.on( prefixActionName( 'nextWeapon:start' ), function(){
			that.switchWeapon( true );
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
	p.switchWeapon = function( forward ){
		var current = this.model.get( 'activeWeapon');
		var weapons = this.model.get( 'weapons' );
		if ( forward ){
			var newWeapon = this.model.get( 'activeWeapon') + 1;
			if ( newWeapon > weapons.length - 1 ) newWeapon = 0;
		} else {
			var newWeapon = this.model.get( 'activeWeapon') - 1;
			if ( newWeapon < 0 ) newWeapon = weapons.length - 1; 
		}
		this.model.set( 'activeWeapon', newWeapon );
		console.log( 'Player '+ this.model.get( 'name' ) + ' switched to ' + weapons[newWeapon]);
	}
	p._shooting = false; 
	p._stopShooting = false;
	p.startShooting = function(){
		this.model.getActiveWeapon().startShooting();
	}
	p.endShooting = function(){
		this.model.getActiveWeapon().stopShooting();
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
			this.vX *= ( 1 - settings.physics.groundFriction/settings.FPS );			
		}
		this.vY *= ( 1 - settings.physics.airFriction/settings.FPS );
		this.vX *= ( 1 - settings.physics.airFriction/settings.FPS );
	}

	return Player;
});
define([
	'underscore',
	'backbone',
	'createjs',
	'models/player',
	'views/player',
	'classes/MapObject',
	'keys',
	'functions/math',
	'models/rope'
], function( _, Backbone, createjs, PlayerM, PlayerV, MapObject, keys, MathFunctions, RopeM ){
	var Player = MapObject.extend({
		/**
		 * the eventBinding states which functions to call for which events
		 * to trigger events on key stroke, events should match the playerSpec.keybindings events
		 * @type {Object}
		 */
		eventBinding: {
			left: 'moveLeft',
			right: 'moveRight',
			up: 'aimUp',
			down: 'aimDown',
			'jump:start': 'jump',
			'shoot:start': 'startShooting',
			'shoot:end': 'endShooting',
			'prevWeapon:start': 'prevWeapon',
			'nextWeapon:start': 'nextWeapon',
			'launchNinjaRope:start': 'launchNinjaRope',
			'dig:start': 'dig'
		},
		/**
		 * @override
		 * used to create event names unique to this player
		 */
		prefixEventName: function( event ){
			return 'p'+ this.id + '-' + event ;
		},
		initialize: function( spec ){
			var that = this;
			this.type = 'player';
            // pass the id to the model
            spec.model.id = this.id;

            spec.model.width = this.w;
            spec.model.height = this.h;
			this.model = new PlayerM( spec.model );
			this.view = new PlayerV({ model: this.model });

			// set the passed key bindings to trigger the appropriate events
			_.each( spec.keyBindings, function( keyCodes, eventName ){
                keys.setBinding( that.prefixEventName( eventName ), keyCodes );
            });

			this.on( 'objectCollision', this.handleCollision );
			this.on( 'kill', function( killedPlayer ){
				that.model.set( 'kills', that.model.get( 'kills' ) + 1 );
				if ( killedPlayer.id === that.id ){
					that.model.set( 'suicides', that.model.get( 'suicides' ) + 1 );
				}
			});
			this.model.on( 'change:health', function( model, health ){
				if ( health <= 0 ){
					that.model.set( 'health', 0 );
					that.die();
				}
			});
		},
		handleCollision: function( object, x, y, vX, vY ){
			if ( this.model.get( 'dead' )) return;
			this.vX += (object.weight/this.weight ) * object.vX;
			this.vY += (object.weight/this.weight ) * object.vX;
			this.model.set( 'lastHitBy', object.fromPlayer );
			this.model.set( 'health', this.model.get( 'health' ) - object.hitDamage );
		},
		die: function(){
			if ( ! this.model.get( 'dead' ) ){
				this.model.set( 'dead', true );
				this.model.set( 'deaths', this.model.get( 'deaths' ) + 1 );
				var that = this;
				this.endShooting();
				this.vX = 0;
				this.vY = 0;
				app.players[ this.model.get( 'lastHitBy') ].trigger( 'kill', this );
				app.removeObjectFromMap( this );
				setTimeout( function(){
					that.respawn();
				}, this.model.get( 'delayTilRespawn' ) )
			}
		},
		respawn: function(){
			this.model.set( 'health', this.model.get( 'totalHealth'));
			app.addObjectToMap( this );
			this.model.set( 'dead', false );
		},
		// actions
		moveLeft: function(){
			if ( this._dead ) return;
			this.model.set( 'facing', 'left' );
			this.vX -= this.model.get( 'moveSpeed' );
		},
		moveRight: function(){
			if ( this._dead ) return;

			this.model.set( 'facing', 'right' );
			this.vX += this.model.get( 'moveSpeed' );
		},
		moveDown: function(){
			if ( this._dead ) return;

			this.vY += this.model.get( 'moveSpeed' );
		},
		moveUp: function(){
			if ( this._dead ) return;

			this.vY -= this.model.get( 'moveSpeed' );
		},
		aimUp: function(){
			if ( this._dead ) return;

			this.model.set({ 'aim': this.model.get( 'aim' ) - 3 }, { validate: true });
		},
		aimDown: function(){
			if ( this._dead ) return;

			this.model.set({ 'aim': this.model.get( 'aim' ) + 3 }, { validate: true });
		},
		jump: function(){
			if ( this._dead ) return;

			var pixelsBelow = [];
			for( var cx = this.x, lenX = this.x + this.w; cx<lenX; cx++ ){
				for( var cy = this.y + this.h, lenY = this.y + this.h + 6; cy<lenY; cy++ ){
					pixelsBelow.push({ x: Math.round( cx ), y: Math.round( cy ) });
				}
			}
			if ( app.map.checkForImpassablePixels( this, pixelsBelow )){
				this.vY -= this.model.get( 'jumpPower' );
			}
		},
		prevWeapon: function(){
			if ( this._dead ) return;

			this.switchWeapon( false );
		},
		nextWeapon: function(){
			if ( this._dead ) return;
			
			this.switchWeapon( true );
		},
		switchWeapon: function( forward ){
			if ( this._dead ) return;
			
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
		},
		startShooting: function(){
			if ( this._dead ) return;

			this.model.getActiveWeapon().startShooting();
		},
		endShooting: function(){
			if ( this._dead ) return;

			this.model.getActiveWeapon().stopShooting();
		},
		launchNinjaRope: function(){
			this.model.get( 'rope' ).launch();
		},
		dig: function(){
			if ( this.facing === 'left' ){
				var dug = app.map.clearPixelsAroundPoint( this.x, this.y + this.h /2, Math.round( this.w *.66 ), this )
			} else {
				var dug = app.map.clearPixelsAroundPoint( this.x + this.w, this.y + this.h/2, Math.round( this.w *.66 ), this );
			}
			if ( dug ){
				this.x = this.lastPos.x;
				this.y = this.lastPos.y;
				this.vX *= .3;
				this.vY *= .3;
			}
		},
		// dig: function(){
		// 	var pixels = [];
		// 	if ( this.model.get( 'facing' ) === 'left' ){
		// 		// var dug = app.map.clearPixelsAroundPoint( this.x, this.y + this.h /2, this.w )
		// 		var amount = MathFunctions.getVelocityComponents( this.model.get( 'digDepth'), - this.model.get( 'aim' ) );
		// 	} else {
		// 		// var dug = app.map.clearPixelsAroundPoint( this.x + this.w, this.y + this.h/2, this.w )
		// 		var amount = MathFunctions.getVelocityComponents( this.model.get( 'digDepth'), this.model.get( 'aim' ) );
		// 	}
		// 	var edgeX, startX, endX, edgeY, startY, endY;
		// 	if ( amount.x > 0 ){
		// 		edgeX = this.x + this.w;
		// 		startX = 0;
		// 		endX = amount.x
		// 	} else {
		// 		edgeX = this.x;
		// 		startX = amount.x;
		// 		endX = 0;
		// 	}
		// 	if ( amount.y > 0 ){
		// 		edgeY = this.y + this.w;
		// 		startY = 0;
		// 		endY = amount.y
		// 	} else {
		// 		edgeY = this.y;
		// 		startY = amount.y;
		// 		endY = 0;
		// 	}
		// 	for ( var x = startX; x <= endX; x++ ){
		// 		for ( var y = startY; y <= endY; y++ ){
		// 			for( var i = 0; i < this.w; i++ ){
		// 				pixels.push({ x: edgeX + x, y: edgeY + y });

		// 			}
		// 		}
		// 	}
		// 	console.log( pixels );
 	// 		var dug = app.map.clearPixels( pixels );
		// 	if ( dug ){
		// 		this.vX = this.lastPos.vX * .5;
		// 		this.vY = this.lastPos.vY * .5;
		// 	}
		// }
	});

	return Player;
});
define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs',
	'models/player',
	'views/player',
	'classes/MapObject',
	'keys'
], function( settings, _, Backbone, createjs, PlayerM, PlayerV, MapObject, keys ){
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
			'nextWeapon:start': 'nextWeapon'
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
				for( var cy = this.y + this.h, lenY = this.y + this.h + 3; cy<lenY; cy++ ){
					pixelsBelow.push({ x: cx, y: cy });
				}
			}	
			if ( app.map.checkForImpassablePixels( pixelsBelow )){
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
		}		
	});

	return Player;
});
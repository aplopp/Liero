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
			// set the passed key bindings to trigger the appropriate events
			_.each( spec.keyBindings, function( keyCodes, eventName ){
                keys.setBinding( that.prefixEventName( eventName ), keyCodes );                
            });
            // pass the id to the model
            spec.model.id = this.id;
	        this.x = spec.x;
	        this.vX = spec.vX;	        
	        this.y = spec.y;
	        this.vY = spec.vY;            
			this.model = new PlayerM( spec.model );
			this.view = new PlayerV({ model: this.model });
		},
		// actions
		moveLeft: function(){
			this.model.set( 'facing', 'left' );
			this.vX -= settings.player.moveSpeed; 
		},
		moveRight: function(){
			this.model.set( 'facing', 'right' );		
			this.vX += settings.player.moveSpeed; 
		},
		aimUp: function(){
			this.model.set({ 'aim': this.model.get( 'aim' ) - 3 }, { validate: true });
		},
		aimDown: function(){
			this.model.set({ 'aim': this.model.get( 'aim' ) + 3 }, { validate: true });
		},
		jump: function(){
			this.vY -= settings.player.jumpPower; 
		},
		prevWeapon: function(){
			this.switchWeapon( false );
		},
		nextWeapon: function(){
			this.switchWeapon( true );
		},
		switchWeapon: function( forward ){
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
			console.log( 'Player '+ this.model.get( 'name' ) + ' switched to ' + weapons[newWeapon].get('name'));
		},
		startShooting: function(){
			this.model.getActiveWeapon().startShooting();
		},
		endShooting: function(){
			this.model.getActiveWeapon().stopShooting();
		}		
	});

	return Player;
});
define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs',
	'models/projectile',
	'views/projectile',
	'classes/MapObject',
	'explosion',
	'keys', 
	'functions/math',
], function( settings, _, Backbone, createjs, ProjectileM, ProjectileV, MapObject, Explosion, keys, MathFunctions ){
	var Projectile = MapObject.extend({
		/**
		 * the eventBinding states which functions to call for which events
		 * to trigger events on key stroke, events should match the playerSpec.keybindings events
		 * @type {Object}
		 */
		eventBinding: {
		},
		initialize: function( spec ){
			var that = this;

			if ( _.has( spec, 'keyBindings') ){
			// set the passed key bindings to trigger the appropriate events				
				_.each( spec.keyBindings, function( keyCodes, eventName ){
	                keys.setBinding( that.prefixEventName( eventName ), keyCodes );                
	            }); 			
	        }

	        this.x = spec.x;
	        this.vX = spec.vX;	        
	        this.y = spec.y;
	        this.vY = spec.vY;

			this.model = new ProjectileM( spec.model );
			this.view = new ProjectileV({ model: this.model });

	        // set up acceleration to accelerate in direction of initial launch
			if ( spec.model.acceleration ){
				var acceleration = MathFunctions.getVelocityComponents( spec.model.acceleration, spec.model.aim );
			} else {
				var acceleration = false;
			}
			this.model.set( 'acceleration', acceleration );
			
			// set time until explosion
			var delayMax = this.model.get( 'delayToExplosion') + this.model.get( 'delayToExplosionVariability' );
			var delayMin = this.model.get( 'delayToExplosion') - this.model.get( 'delayToExplosionVariability' );
			setTimeout( function(){
				that.explode();
			}, MathFunctions.getRandomNumberBetween( delayMin, delayMax ) );

		}, 
		explode: function( ){
			var that = this;
			var explosionSpec = this.model.get( 'explosion' );
			var explosion = new Explosion({ 
				x: this.x , // center x
				y: this.y, // center y
				vX: this.vX, 
				vY: this.vY,
				model: explosionSpec
			});
			app.removeObject( this.id );
			app.addObject( explosion );

		},

	});

	return Projectile;
});
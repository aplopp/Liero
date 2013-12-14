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
	        this.w = this.w;

            spec.model.width = this.w;
            spec.model.height = this.h;
			this.model = new ProjectileM( spec.model );
			this.view = new ProjectileV({ model: this.model });

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
				x: this.x + this.w / 2 , // center x
				y: this.y + this.h / 2, // center y
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
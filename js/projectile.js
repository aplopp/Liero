define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs',
	'models/projectile',
	'views/projectile',
	'classes/MapObject',
	'keys'
], function( settings, _, Backbone, createjs, ProjectileM, ProjectileV, MapObject, keys ){
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
		}		
	});

	return Projectile;
});
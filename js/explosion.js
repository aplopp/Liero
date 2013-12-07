define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs', 
	'models/explosion',
	'views/explosion', 
	'classes/MapObject'
], function( settings, _, Backbone, createjs, ExplosionM, ExplosionV, MapObject ){
	var Explosion = MapObject.extend({
		initialize: function( spec ){
			var that = this;

			if ( _.has( spec, 'keyBindings') ){
			// set the passed key bindings to trigger the appropriate events				
				_.each( spec.keyBindings, function( keyCodes, eventName ){
	                keys.setBinding( that.prefixEventName( eventName ), keyCodes );                
	            }); 			
	        }
	        this.x = spec.x;
	        // this.vX = spec.vX;	        
	        this.y = spec.y;
	        // this.vY = spec.vY;
	        
	        // explosions are stationary
	        this.vX = 0;
	        this.vY = 0; 
			this.model = new ExplosionM( spec.model );
			this.view = new ExplosionV({ model: this.model });
	        
	        this.view.setPos({
	        	x: this.x,
	        	y: this.y
	        });

			var msPerFrame = 1000/settings.FPS;
			// console.log( msPerFrame, spec.model, this.model.attributes );
			// percent of animation to do in each frame
	        this.eachFramePercent = msPerFrame / this.model.get( 'duration' );
		},
		counter: 0,
		nextPosition: function(){
			// explosions don't change positions, no sir
			var progress = this.counter * this.eachFramePercent;
			if( progress > 1 ){
				app.removeObject( this.id );
				return;
			}
			// handle radius
			this.model.set( 'currentRadius', this.model.get( 'radius') * ( 1 - Math.abs( progress * 2 - 1) ));
			this.counter++;			
		}
 	});		
	return Explosion;
});
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
		// a temp array of colors on the way to the destination color
		_transColors: false,
		nextPosition: function(){
			// explosions don't change positions, no sir
			var progress = this.counter * this.eachFramePercent;
			if( progress > 1 ){
				app.removeObject( this.id );
				return;
			}


			// handle colors 
			
			var colors = this.model.get( 'colors' );
			var colorProg = progress * ( colors.length - 1 );
			var colorIndex = Math.floor( colorProg );
			var colorPos = colorProg % 1;
			var fromColor = colors[ colorIndex ];
			var toColor = colors[ colorIndex + 1 ];	
			var color = [0,0,0,0];
			if ( colorIndex === colors.length - 1 ){
				color = colors[ colors.length - 1 ];
			} else {
				color = _.map( color, function(num, index ){
					var from = fromColor[ index ];
					var to = toColor[ index ];
					return Math.round( from + ( to - from ) * colorPos );
				});
			}
			this.model.set( 'color', color );

			// handle radius
			this.model.set( 'currentRadius', this.model.get( 'radius') * ( 1 - Math.abs( progress * 2 - 1) ));
			this.counter++;			
		}
 	});		
	return Explosion;
});
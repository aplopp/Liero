define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs', 
	'models/explosion',
	'views/explosion', 
	'classes/MapObject',
	'functions/math'
], function( settings, _, Backbone, createjs, ExplosionM, ExplosionV, MapObject, MathFunctions ){
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

			// handle animation 
			var animation = this.model.get( 'animation' );
			// handle color animation 
			var colors = animation.colors;
			var color = MathFunctions.getGradiatedPropertyAtProgress( colors, progress );
			this.model.set( '_color', color );
			var radius = MathFunctions.getGradiatedPropertyAtProgress( animation.radius, progress );
			this.model.set( '_radius', radius );


			// var fromColorObj = false; 
			// var toColorObj = false; 
			// var color = false;
			// _.each( colors, function( obj, index ){
			// 	if ( color ) return; // if color found, done

			// 	if ( progress === obj.position ){ // if on the head, obviously use that color
			// 		color = obj.color;
			// 	} else if ( progress > obj.position ){ // if you passed a colors position, set to and from
			// 		fromColorObj = colors[ index ]; 					
			// 		toColorObj = index <= colors.length-1 ? colors[ index + 1 ] : false;
			// 	}
			// });
			// if ( ! color ){
			// 	// check if one is set and not the other
			// 	if ( toColorObj && !fromColorObj ){
			// 		color = toColorObj.color;
			// 	} else if ( fromColorObj && !toColorObj ){
			// 		color = fromColorObj.color;
			// 	}
			// }
			// // find the color between the two
			// if ( ! color ){
			// 	var colorProg = ( progress - fromColorObj.position )/(toColorObj.position - fromColorObj.position);
			// 	color = [ 0, 0, 0, 0 ];
			// 	color = _.map( color, function(num, index ){
			// 		var from = fromColorObj.color[ index ];
			// 		var to = toColorObj.color[ index ];
			// 		return Math.round( from + ( to - from ) * colorProg );
			// 	});
			// }

			// // handle radius
			// var radiuses = animation.radius;
			// _.each( radiuses, function( obj, index ){
			// 	if ( radius ) return; // if color found, done

			// 	if ( progress === obj.position ){ // if on the head, obviously use that color
			// 		radius = obj.radius;
			// 	} else if ( progress > obj.position ){ // if you passed a colors position, set to and from
			// 		fromRadiusObj = radiuses[ index ]; 					
			// 		toRadiusObj = index <= radiuses.length-1 ? radiuses[ index + 1 ] : false;
			// 	}
			// });
			// if ( ! color ){
			// 	// check if one is set and not the other
			// 	if ( toColorObj && !fromColorObj ){
			// 		color = toColorObj.color;
			// 	} else if ( fromColorObj && !toColorObj ){
			// 		color = fromColorObj.color;
			// 	}
			// }
			// // find the color between the two
			// if ( ! color ){
			// 	var colorProg = ( progress - fromColorObj.position )/(toColorObj.position - fromColorObj.position);
			// 	color = [ 0, 0, 0, 0 ];
			// 	color = _.map( color, function(num, index ){
			// 		var from = fromColorObj.color[ index ];
			// 		var to = toColorObj.color[ index ];
			// 		return Math.round( from + ( to - from ) * colorProg );
			// 	});
			// }			
			this.counter++;			
		}
 	});		
	return Explosion;
});
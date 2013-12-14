define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs', 
	'models/explosion',
	'views/explosion', 
	'classes/MapObject',
	'functions/math',
	'functions/color'
], function( settings, _, Backbone, createjs, ExplosionM, ExplosionV, MapObject, MathFunctions, ColorFunctions ){
	var _explosionAnimationsIndex = {};
	// helpers
	function _createExplosionUniqueID( explosion ){
		var duration = explosion.duration;
		var id = explosion.duration;
		_.each( explosion.animation, function( propAnim, propName ){
			id += propName;
			_.each( propAnim, function( step ){
				id += ( step.value + '-' + step.position ); 
			});
		});
		return id;
	}
	function _recordAnimationFrames( explosion ){
		var animationFrames = [];
		// handle animation 
		var animationSpec = explosion.animation;
		var colors = animationSpec.colors;
		var radiuses = animationSpec.radius;

		var msPerFrame = 1000/settings.FPS;
		// percent of animation to do in each frame
        var eachFramePercent = msPerFrame / explosion.duration ;
        var frameCount = 0;
        var progress = 0;
        while( progress < 1){
			progress = frameCount * eachFramePercent;
			animationFrames.push({
				color: ColorFunctions.getRgbaString( MathFunctions.getGradiatedPropertyAtProgress( colors, progress )),
				radius: MathFunctions.getGradiatedPropertyAtProgress( radiuses, progress )
			});
        	frameCount++;
        }
        animationFrames.push({
			color: MathFunctions.getGradiatedPropertyAtProgress( colors, 1 ),
			radius: MathFunctions.getGradiatedPropertyAtProgress( radiuses, 1 )
		});

        return animationFrames;    
	}
	var Explosion = MapObject.extend({
		initialize: function( spec ){
			var that = this;

			if ( _.has( spec, 'keyBindings') ){
			// set the passed key bindings to trigger the appropriate events				
				_.each( spec.keyBindings, function( keyCodes, eventName ){
	                keys.setBinding( that.prefixEventName( eventName ), keyCodes );                
	            }); 			
	        }
	        
	        // explosions are stationary
	        this.vX = 0;
	        this.vY = 0; 
			this.model = new ExplosionM( spec.model );
			this.view = new ExplosionV({ model: this.model });
	        
	        this.lastPos = {
	        	x: this.x, 
	        	y: this.y,
	        	vY: this.vY,
	        	vX: this.vX
	        };
	        this.view.setPos({
	        	x: this.x,
	        	y: this.y
	        });
			// TODO	
			// check if there is a simple string type set
			if ( ! spec.model._type ){
				// if not, generate a unique id for its attributes
				spec.model._type = _createExplosionUniqueID( spec.model );
			}
			
			if ( ! _.has( _explosionAnimationsIndex, spec.model._type ) ){
				_explosionAnimationsIndex[ spec.model._type ] = _recordAnimationFrames( spec.model );
			}
			this._animationFrames = _explosionAnimationsIndex[ spec.model._type ];    
		},		
		_animationFrames: [],		
		frameCount: 0,	
		nextPosition: function(){
			// explosions don't change positions, no sir
			if( this.frameCount > this._animationFrames.length - 1 ){
				app.removeObject( this.id );
				return;
			}
			this.model.set( '_color', this._animationFrames[ this.frameCount ].color );
			this.model.set( '_radius', this._animationFrames[ this.frameCount ].radius );
			this.frameCount++;
		}
 	});		
	return Explosion;
});
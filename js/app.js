define([ 
	'underscore', 
	'backbone',
	'jquery',
	'createjs',
	'map', 
	'player', 
	'keys', 
	'functions/color'
], function( _, Backbone, $, createjs, Map, Player, keys, ColorFunctions ){
	Backbone.$ = $;
	var noop = function(){}

	/**
	 * Main function for game.
	 */
	function App( ){
		var that = this; 
		
		// declare vars

		this.settings;
		this.map;
		this.players; 
		this.stage; 

		// support events
		_.extend(this, Backbone.Events); 

		/**
		 * After setting up map, sets up players, other objects, and kicks it off.
		 */
		this.init = function( settings ){
			// make a copy of original settings for reference
			this._origSettings = $.extend( {}, settings );
			this.settings = that.initSettings( settings );
			this.keys = keys;

			this.getMap( function( map ){
				that.map = map;
				that.players = that.createPlayers();			
				that.stage = that.createStage();
				
				that.addInitialObjectsToStage();
				that.start();
			});
		}
		/**
		 * Goes through settings and converts values like colors
		 * or other things that would have to be done over and over
		 * @param  {[type]} settings [description]
		 * @return {[type]}          [description]
		 */
		this.initSettings = function( settings ){
			_.each( settings.explosions, function( explosionSpec, key ){
				// change colors to rgba array
				settings.explosions[key].animation.colors = _.map( explosionSpec.animation.colors, function( obj ){
					if ( _.isArray( obj ) ) return;
					return _.extend( obj, { value: ColorFunctions.getColorRgba( obj.value ) });
				});
				// sort by position
				settings.explosions[key].animation.colors = _.sortBy( explosionSpec.animation.colors, function(obj){
					return obj.position;
				});
			});
			return settings;
		}
		/**
		 * Grab the map file specified in the settings, and based on that, create a new Map(). 
		 * @param {function} callback 
		 */
		this.getMap = function( cb ){
			cb = cb || noop;
			require([ 'maps/' + this.settings.map ], function( mapSpec ){
				cb( new Map( mapSpec ) );
			} );	
		}
		/**
		 * Add players to the map
		 */
		this.createPlayers = function(){
			var players = [];

			_.each( this.settings.players, function( playerSpec ){	
				players.push( new Player( playerSpec )); 
			});
			return players;			
		}		
		/**
		 * Create stage over the top of the map, and add players and other objects to it.
		 */
		this.createStage = function(){
			var canvas = document.getElementById( this.settings.canvasID);
			canvas.width = this.map.settings.width; 
			canvas.height = this.map.settings.height; 
			return new createjs.Stage( canvas );
		}
		this.mapObjects = [];
		this.addInitialObjectsToStage = function(){
			// add players to stage. 
			_.each( this.players, function( player ){
				that.addObject( player );
			});
		}
		this.addObject = function( mapObject ){
			var shape = mapObject.view.render();
			this.mapObjects.push( mapObject );
			this.stage.addChild( shape );
		}
		this.removeObject = function( id ){
			var object = _.findWhere( this.mapObjects, { id: id });
			this.mapObjects = _.reject( this.mapObjects, function( mapObject ){ return mapObject.id === id });
			this.stage.removeChild( object.view.render({}) );
			
			delete object;
		}
		/**
		 * advance the objects position based on x and y velocity
		 */
		this.nextObjectPositions = function(){
			_.each( this.mapObjects, function( mapObject ){
				/** based on velocity and position, move pointer to next position */
				mapObject.nextPosition();
				/** adjust items that will be offscreen, and therefore have collided with the map edge. */				
				that.respondToEdgeCollision( mapObject ); 
				
			});	
		}
		/**
		 * check whether the item is off the map
		 */
		this.respondToEdgeCollision = function( mapObject ){
			var hadCollision = false; 				
			var x = mapObject.x;
			var vX = mapObject.vX; 
			var y = mapObject.y; 				
			var vY = mapObject.vY; 
 			var offX = offY = false; 
			do {
				offX = that.checkOffX( x, mapObject.model.attributes.width );
				offY = that.checkOffY( y, mapObject.model.attributes.height );

				if ( offX ){
					hadCollision = true; 
					var collisionX = offX < 0 ? 0 : that.map.canvas.width ; 
					if ( offX < 0 ){
						var collisionX = 0;
					} else {
						var collisionX = that.map.canvas.width - mapObject.model.attributes.width;
					}					
					var results = that.resolveBounceX( collisionX, x, vX, mapObject.physics.bounce );
					x = results.x; 
					vX = results.vX;	
				}
				if ( offY ){
					hadCollision = true; 
					if ( offY < 0 ){
						var collisionY = 0;
					} else {
						var collisionY = that.map.canvas.height - mapObject.model.attributes.height;
					}
					var results = that.resolveBounceY( collisionY, y, vY, mapObject.physics.bounce );
					y = results.y; 
					vY = results.vY;
				}
			} while( offX || offY );

			if ( hadCollision ){
				mapObject.vY = vY; 
				mapObject.vX = vX; 
				mapObject.x = x;
				mapObject.y = y;
			}			
		}
		/**
		 * check if object is offscreen on the X axis
		 */
		this.checkOffX = function( x, w ){
			if ( x + w > that.map.canvas.width ){
				return x + w - that.map.canvas.width; 
			} else if ( x < 0){
				return x;
			}	
			return false; 
		}
		/**
		 * check if object is offscreen on the Y axis
		 */
		this.checkOffY = function( y, h ){
			if ( ( y + h ) > that.map.canvas.height ){
				return y + h - that.map.canvas.height; 
			} else if ( y < 0){
				return y;
			}
			return false; 
		}
		/**
		 * returns the endX and the endV after a bounce; 
		 * @param {collisionX} - where the collision happened
		 * @param {endX} - where the object would have ended up
		 * @param {vX} - how fast the object would have been traveling
		 * @returns {object} - the bounced x pos and velocity 
		 */
		this.resolveBounceX = function( collisionX, endX, vX, bounciness ){
			var friction = this.settings.physics.groundFriction; 
			return {
				x: collisionX - ( endX - collisionX ),
				vX: -1 * bounciness * vX
			}
		}
		/**
		 * returns the endY and the endY after a bounce; 
		 * @param {collisionY} - where the collision happened
		 * @param {endY} - where the object would have ended up
		 * @param {vY} - how fast the object would have been traveling
		 * @returns {object} - the bounced y pos and velocity 
		 */
		this.resolveBounceY = function( collisionY, endY, vY, bounciness ){
			var gravity = this.settings.physics.gravity; 
			var friction = this.settings.physics.groundFriction; 
			return {
				y: collisionY - ( endY - collisionY ),
				vY: -1 * bounciness * vY
			}
		}

		this.start = function(){
			this.ticker = createjs.Ticker;
			this.ticker.setFPS( this.settings.FPS );
			if ( window.location.hash ){
				$( '#' + this.settings.canvasID).on( 'click', function(){
					that.keys.triggerActions(); 
					that.nextObjectPositions();
					that.nextFrame();
				});					
			} else {
				this.ticker.addEventListener( 'tick', function(){
					that.keys.triggerActions(); 
					that.nextObjectPositions();
					that.nextFrame();
				});
			}
		};
		this.nextFrame = function(){
			this.stage.update();
		}
	}

	return new App();
});
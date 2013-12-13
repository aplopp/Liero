define([ 
	'underscore', 
	'backbone',
	'jquery',
	'createjs',
	'map', 
	'player', 
	'keys', 
	'functions/color', 
	'settings'
], function( _, Backbone, $, createjs, Map, Player, keys, ColorFunctions, settings ){
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
				that.respondToWallCollision( mapObject ); 
				
			});	
		}
		/**
		 * check whether the item is off the map
		 */
		this.respondToWallCollision = function( mapObject ){
			var offscreen = this.map.isMapObjectOffMap( mapObject );
			var hadCollision = offscreen.x || offscreen.y;
			while( offscreen.x || offscreen.y ) {
				if ( offscreen.x ){
					var collisionX = offscreen.x < 0 ? 0 : that.map.canvas.width ; 
					if ( offscreen.x < 0 ){
						var collisionX = 0;
						// cancel velocity entirely if doing itty bitty bounces
						if ( mapObject.vX < 0 && mapObject.vX > -20 ){
							mapObject.vX = 0;		
						}
					} else {
						var collisionX = that.map.canvas.width - mapObject.model.attributes.width;
						// cancel velocity entirely if doing itty bitty bounces						
						if ( mapObject.vX > 0 && mapObject.vX < 20 ){
							mapObject.vX = 0;	
						}
					}					
					var results = that.resolveWallBounceX( collisionX, mapObject );
					mapObject.x = results.point; 
					mapObject.vX = results.velocity;	
					mapObject.vY *= ( 1 - settings.physics.surfaceFriction );
				}
				if ( offscreen.y ){
					if ( offscreen.y < 0 ){
						var collisionY = 0;
						// cancel velocity entirely if doing itty bitty bounces						
						if ( mapObject.vY < 0 && mapObject.vY > -25 ){
							mapObject.vY = 0;	
						}	
					} else {
						var collisionY = that.map.canvas.height - mapObject.model.attributes.height;
						// cancel velocity entirely if doing itty bitty bounces						
						if ( mapObject.vY > 0 && mapObject.vY < 25 ){
							mapObject.vY = 0;	
						}						
					}
					var results = that.resolveWallBounceY( collisionY, mapObject );
					mapObject.y = results.point; 
					mapObject.vY = results.velocity;
					mapObject.vX *= ( 1 - settings.physics.surfaceFriction );
				}
				offscreen = this.map.isMapObjectOffMap( mapObject );			
			} ;
		}
		/**
		 * returns the end coord and the endV after a bounce; 
		 * @param {collisionX} - where the collision happened
		 * @param {endX} - where the object would have ended up
		 * @param {vX} - how fast the object would have been traveling
		 * @returns {object} - the bounced position and velocity
		 */
		this.resolveWallBounceX = function( collisionPoint, mapObject, acceleration ){
			var prevPoint = mapObject.lastPos.x;
			var acceleration = mapObject.physics.acceleration.x;
			return {
				point: collisionPoint - ( mapObject.x - collisionPoint ),
				velocity: -1 * mapObject.physics.bounce * mapObject.vX
			}
		}
		/**
		 * returns the end coord and the endV after a bounce; 
		 * @param {collisionX} - where the collision happened
		 * @param {endX} - where the object would have ended up
		 * @param {vX} - how fast the object would have been traveling
		 * @returns {object} - the bounced position and velocity
		 */
		this.resolveWallBounceY = function( collisionPoint, mapObject, acceleration ){
			var prevPoint = mapObject.lastPos.y;
			var prevV = mapObject.lastPos.vY;
			// includes gravity
			var acceleration = settings.physics.gravity * mapObject.physics.gravity + mapObject.physics.acceleration.y;
			// var y = ax*x + bx + c;
			// var collisionPoint = acceleration * t2 + prevV*t + prevPoint;
			// y = collisionPoint
			// a = acceleration
			// x = t
			// b = prevV
			// c = prevPoint
			// // solve for t
			// t = ( -prevV - Math.sqrt( prevV * prevV - 4 * acceleration * prevPoint ) ) / 2 * acceleration;
			// console.log( 'PREV Velocity: ' + prevV, 'acceleration: ' + acceleration, 'prevPoint: ' + prevPoint, t );

			return {
				point: collisionPoint - ( mapObject.y - collisionPoint ),
				velocity: -1 * mapObject.physics.bounce * mapObject.vY
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
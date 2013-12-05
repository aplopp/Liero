define([ 
	'underscore', 
	'backbone',
	'jquery',
	'createjs',
	'map', 
	'player', 
	'keys'
], function( _, Backbone, $, createjs, Map, Player, keys ){
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
			this.settings = settings;
			this.keys = keys;

			this.getMap( function( map ){
				that.map = map;
				that.players = that.createPlayers();			
				that.stage = that.createStage();
				
				that.addObjectsToStage();
				that.start();
			});
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
		this.addObjectsToStage = function(){
			// add players to stage. 
			_.each( this.players, function( player ){
				var playerShape = player.view.render();
				that.stage.addChild( playerShape );
			});
		}
		/**
		 * advance the objects position based on x and y velocity
		 */
		this.nextObjectPositions = function(){
			_.each( this.players, function( player ){
				/** based on velocity and position, move pointer to next position */
				player.nextPosition();

				/** adjust items that will be offscreen, and therefore have collided with the map edge. */				
				that.respondToEdgeCollision( player ); 
				
			});	
		}
		/**
		 * check whether the item is off the map
		 */
		this.respondToEdgeCollision = function( player ){
			var hadCollision = false; 				
			var x = player.x;
			var vX = player.vX; 
			var y = player.y; 				
			var vY = player.vY; 

			var offX = offY = false; 
			do {
				offX = that.checkOffX( x, player.model.attributes.width );
				offY = that.checkOffY( y, player.model.attributes.height );

				if ( offX ){
					hadCollision = true; 
					var collisionX = offX < 0 ? 0 : that.map.canvas.width ; 
					if ( offX < 0 ){
						var collisionX = 0;
					} else {
						var collisionX = that.map.canvas.width - player.model.attributes.width;
					}					
					var results = that.resolveBounceX( collisionX, x, vX, that.settings.player.bounce );
					x = results.x; 
					vX = results.vX;	
				}
				if ( offY ){
					hadCollision = true; 
					if ( offY < 0 ){
						var collisionY = 0;
					} else {
						var collisionY = that.map.canvas.height - player.model.attributes.height;
					}
					var results = that.resolveBounceY( collisionY, y, vY, that.settings.player.bounce );
					y = results.y; 
					vY = results.vY;
				}
			} while( offX || offY );

			if ( hadCollision ){
				player.vY = vY; 
				player.vX = vX; 
				player.x = x;
				player.y = y;
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
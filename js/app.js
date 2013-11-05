define([ 
	'underscore', 
	'backbone',
	'jquery',
	'createjs',
	'map', 
	'player'
], function( _, Backbone, $, createjs, Map, Player ){
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

		/**
		 * After setting up map, sets up players, other objects, and kicks it off.
		 */
		this.init = function( settings ){
			var that = this;
			this.settings = settings;
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
				console.log( playerSpec );		
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
			var that = this;
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
			var that = this;
			_.each( this.players, function( player ){
				player.nextPosition();
				var hadCollision = false; 
				
				var x = player.model.attributes.x;
				var vX = player.vX; 
				var y = player.model.attributes.y; 				
				var vY = player.vY; 
				var offX = offY = false; 
				do {
					offX = that.checkOffX( x, player.model.attributes.width );
					offY = that.checkOffY( y, player.model.attributes.height );

					if ( offX ){
					hadCollision = true; 
						var collisionX = offX < 0 ? 0 : that.map.canvas.width ; 
						var results = that.resolveBounceX( collisionX, player.model.attributes.x, player.vX, that.settings.player.bounce );
						x = results.x; 
						vX = results.vX;	
					}
					if ( offY ){
						hadCollision = true; 
						var collisionY = offY < 0 ? 0 : that.map.canvas.height ; 
						var results = that.resolveBounceY( collisionY, y, vY, that.settings.player.bounce );
						y = results.y; 
						vY = results.vY;
					}
				} while( offX || offY );

				if ( hadCollision ){
					player.vY = vY; 
					player.vX = vX; 
					player.model.set( 'x', x );
					player.model.set( 'y', y );
				}
			});	
		}
		/**
		 * check if object is offscreen on the X axis
		 */
		this.checkOffX = function( x, w ){
			if ( x > that.map.canvas.width ){
				return x - that.map.canvas.width; 
			} else if ( x < 0){
				return x;
			}	
			return false; 
		}
		/**
		 * check if object is offscreen on the Y axis
		 */
		this.checkOffY = function( y, h ){
			if ( y > that.map.canvas.height ){
				return y - that.map.canvas.height; 
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
		
		/**
		 * Track and route key presses to actions. 
		 */
		this.handleKeyPresses = function(){

		}		
		this.start = function(){
			this.ticker = createjs.Ticker;
			this.ticker.setFPS( this.settings.FPS );
			// $( '#' + this.settings.canvasID).on( 'click', function(){
			this.ticker.addEventListener( 'tick', function(){
				that.handleKeyPresses(); 
				that.nextObjectPositions();
				that.nextFrame();
			});
		};
		this.nextFrame = function(){
			this.stage.update();
		}
	}

	return new App();
});
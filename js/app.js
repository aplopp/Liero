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
				// only update and check for collisions if its moving. 
				if ( player.vX || player.vY ){

				// CHECK FOR ON-MAP
					var w = player.model.attributes.width; 
					var h = player.model.attributes.height; 
					var x = player.model.attributes.x;
					var y = player.model.attributes.y;
					var prevX = x; 
					var prevY = y;
					var vX = player.vX; 
					var vY = player.vY; 
					var onMap = true; // the object obviously starts on the map
					
					var offY = false;	// object is off the map in the Y direction
					var offX = false;	// object is off the map in the X direction
					var hadCollision = false; // flag if a collision was encountered.					
					do {
						offX = offY = false; 
						// check if X if offscreen
						if ( x > that.map.canvas.width ){
							offX = x - that.map.canvas.width; 
						} else if ( x < 0){
							offX = x;
						}	
						// check if Y if offscreen						
						if ( y > that.map.canvas.height ){
							offY = y - that.map.canvas.height; 
						} else if ( y < 0){
							offY = y;
						}
						// if X is offscreen, adjust velocity and reflect to new position		
						if ( offX ){ // x offscreen (hit edge)
							hadCollision = true; 							
							vX *= -1 * that.settings.player.bounce; 	
							if ( offX > 0 ){
								x = that.map.canvas.width - ( offX * that.settings.player.bounce ) ;									
							} else {
								x = -offX * that.settings.player.bounce; 
							}
						} 
						if ( offY ){ // y offscreen (hit edge)
							hadCollision = true; 

							// 1) find total distance from start to collision
							// energy lost in bounce
							vY *= -1 * that.settings.player.bounce;

							vY -= that.settings.physics.gravity; // TODO: adjust gravity based on how far it traveled until the collision

							if ( offY > 0 ){
								var d = prevY - prev
								y = that.map.canvas.height - ( offY * that.settings.player.bounce ) ;									
							} else {
								y = -offY * that.settings.player.bounce; 
							}
							if ( Math.abs( vY ) < 3 && offY < 1.5 ){
								vY = 0;
								y = that.map.canvas.height;
								offY = false; 
							}
						}
					} while( offX || offY );

					if ( hadCollision ){
						player.vY = vY; 
						player.vX = vX; 
						player.model.set( 'x', x );
						player.model.set( 'y', y );
					}
				}				
			});	
		}
		this.checkOffX = function( x, w ){

		}
		this.checkOffY = function( y, h ){

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
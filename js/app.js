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
				that.map.checkWallCollision( mapObject ); 
				
			});	
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
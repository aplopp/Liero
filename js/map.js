define([ 
	'underscore', 
	'backbone',
	'createjs',
	'settings'
], function( _, Backbone, createjs, settings ){
	var defaults = {
		width: 1000, 
		height: 500,
		layout: []
	}
	function Map( mapSpec ){
		this.settings = _.extend( defaults, mapSpec );

		this.grid = this.settings.layout;
		this.canvas = document.getElementById( 'stage-bg' ); 
		this.canvas.width = this.settings.width;
		this.canvas.height = this.settings.height;

		this.simpleGrid = this.getSimpleGrid(); 

		// create map, add generated pixels to canvas 
		this.generateMap();

	}
	/**
	 * generates canvas based on the map data
	 */
	Map.prototype.generateMap = function(){
		var ctx = this.canvas.getContext( '2d' );
		var imageData = ctx.createImageData( this.settings.width, this.settings.height );
		var pixelIndex = 0;
		var index = 0;
		_.each( this.grid, function( col ){
			_.each( col, function( row ){
				if ( _.isArray( row.color )){
					imageData.data[ index ] = row.color[0];
					imageData.data[ index + 1] = row.color[1];
					imageData.data[ index + 2] = row.color[2];
					imageData.data[ index + 3] = row.color[3];
				}				
				index += 4;				
			});
		});
		ctx.putImageData( imageData, 0, 0 );		
	}
	/**
	 * simplifies the grid to a single 'type' number...whether the player (or objects) can pass through, or no. 
	 */
	Map.prototype.getSimpleGrid = function(){
		var simpleGrid = [];
		var impassableCol = [];
		for( var i = 0; i < this.canvas.width; i++ ){
			impassableCol.push( 1 ); // unpassable left; 
		}
		simpleGrid.push( impassableCol ); 
		_.each( this.grid, function( col ){
			simpleCol = []; 
			simpleCol.push( 1 ); // unpassable top
			_.each( col, function( row ){
				simpleCol.push( row.type );
			});
			simpleCol.push( 1 ); // unpassable bottom
			simpleGrid.push( simpleCol );
		});		
		simpleGrid.push( impassableCol ); 
		return simpleGrid; 
	};
	/**
	 * Compares a mapObject to the map to see if its offscreen.
	 * @param  {object} mapObject
	 * @return {object} x, y - true, or a number (if offscreen)
	 */
	Map.prototype.isMapObjectOffMap = function( mapObject ){
		return {
			x: this.checkOffX( mapObject.x, mapObject.model.get( 'width' ) ),
			y: this.checkOffY( mapObject.y, mapObject.model.get( 'height' ) )
		}
	}
	/**
	 * check if object is offscreen on the X axis
	 */
	Map.prototype.checkOffX = function(x, w){
		if ( x + w > this.canvas.width ){
			return x + w - this.canvas.width; 
		} else if ( x < 0){
			return x;
		}	
		return false; 		
	};
	/**
	 * check if object is offscreen on the Y axis
	 */	
	Map.prototype.checkOffY = function(y, h){
		if ( ( y + h ) > this.canvas.height ){
			return y + h - this.canvas.height; 
		} else if ( y < 0){
			return y;
		}
		return false; 
	};

	/**
	 * 1) check whether the item is off the map
	 * 2) If it is, handle the wall collision
	 */
	Map.prototype.checkWallCollision = function( mapObject ){
		var offscreen = this.isMapObjectOffMap( mapObject );
		var hadCollision = offscreen.x || offscreen.y;
		while( offscreen.x || offscreen.y ) {
			if ( offscreen.x ){
				var collisionX = offscreen.x < 0 ? 0 : this.canvas.width ; 
				if ( offscreen.x < 0 ){
					var collisionX = 0;
					// cancel velocity entirely if doing itty bitty bounces
					if ( mapObject.vX < 0 && mapObject.vX > -20 ){
						mapObject.vX = 0;		
					}
				} else {
					var collisionX = this.canvas.width - mapObject.model.attributes.width;
					// cancel velocity entirely if doing itty bitty bounces						
					if ( mapObject.vX > 0 && mapObject.vX < 20 ){
						mapObject.vX = 0;	
					}
				}					
				var results = this.resolveWallCollisionX( collisionX, mapObject );
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
					var collisionY = this.canvas.height - mapObject.model.attributes.height;
					// cancel velocity entirely if doing itty bitty bounces						
					if ( mapObject.vY > 0 && mapObject.vY < 25 ){
						mapObject.vY = 0;	
					}						
				}
				var results = this.resolveWallCollisionY( collisionY, mapObject );
				mapObject.y = results.point; 
				mapObject.vY = results.velocity;
				mapObject.vX *= ( 1 - settings.physics.surfaceFriction );
			}
			offscreen = this.isMapObjectOffMap( mapObject );			
		} ;
	}
	/**
	 * returns the end coord and the endV after a bounce; 
	 * @param {collisionX} - where the collision happened
	 * @param {endX} - where the object would have ended up
	 * @param {vX} - how fast the object would have been traveling
	 * @returns {object} - the bounced position and velocity
	 */
	Map.prototype.resolveWallCollisionX = function( collisionPoint, mapObject, acceleration ){
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
	Map.prototype.resolveWallCollisionY = function( collisionPoint, mapObject, acceleration ){
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
	Map.prototype.isObjectInOccupiedSpace = function( mapObject ){
		return {
			x: this.checkOffX( mapObject.x, mapObject.model.get( 'width' ) ),
			y: this.checkOffY( mapObject.y, mapObject.model.get( 'height' ) )
		}
	}
	return Map; 
});
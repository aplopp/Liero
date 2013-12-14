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
		// var impassableCol = [];
		// for( var i = 0; i < this.canvas.width; i++ ){
		// 	impassableCol.push( 1 ); // unpassable left; 
		// }
		// simpleGrid.push( impassableCol ); 
		_.each( this.grid, function( col ){
			simpleCol = []; 
			// simpleCol.push( 1 ); // unpassable top
			_.each( col, function( row ){
				simpleCol.push( row.type );
			});
			// simpleCol.push( 1 ); // unpassable bottom
			simpleGrid.push( simpleCol );
		});		
		// simpleGrid.push( impassableCol ); 
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

	Map.prototype.adjustForAnyCollision = function( mapObject ){
		// this.handleWallCollision( mapObject );
		this.handleMapCollision( mapObject );
	}
	/**
	 * 1) check whether the item is off the map
	 * 2) If it is, handle the wall collision
	 */
	Map.prototype.handleWallCollision = function( mapObject ){
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
	/**
	 * 1) Checks to see if the path of the item intersects any map particles, 
	 * 2) resolves resulting path position and velocity accordingly
	 */
	Map.prototype.handleMapCollision = function( mapObject ){
		var x1 = Math.floor( mapObject.lastPos.x );
		var x2 = Math.floor( mapObject.x );
		var y1 = Math.floor( mapObject.lastPos.y );
		var y2 = Math.floor( mapObject.y );
		var w = mapObject.model.get( 'width' );
		var h = mapObject.model.get( 'height' );

		// counter vars
		var y;
		var x;
		// this massive loop checks the leading edges for the 4 directions the mapObject could go.
		if ( x2 >= x1 ){
			if ( y2 >= y1 ){
				// both positive (down + right)
				for( x = x1; x <= x2; x++){
					for ( y = y1; y <= y2; y++){
						var leadingRightEdge = [];
						var leadingBottomEdge = [];
						for( var i = 0; i < h; i++){
							leadingRightEdge.push({ x: x + w + 1, y: y + i });
						}
						for( var i = 0; i < w; i++){
							leadingBottomEdge.push({ x: x+ i, y: y + h + 1  });
						}
						var occupiedRight = this.checkForImpassablePixels( leadingRightEdge, true );
						var occupiedBelow = this.checkForImpassablePixels( leadingBottomEdge, false );
						if ( occupiedRight || occupiedBelow ){
							var percentThroughPath = ( (x - x1)*(y - y1) ) / ((x2 - x1 ) * ( y2 - y1 ));

							if ( occupiedRight ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedBelow ){
								this.handleTopBottomCollision( mapObject, y );
							}
							return;
						}
					}
				}				
			} else {
				// x pos, y neg (up + right)
				for( x = x1; x <= x2; x++){
					for ( y = y1; --y>=y2;){
						var leadingTopEdge = [];
						var leadingRightEdge = [];
						for( var i = 0; i < h; i++){
							leadingRightEdge.push({ x: x + w + 1, y: y + i });
						}
						for( var i = 0; i < w; i++){
							leadingTopEdge.push({ x: x+ i, y: y - 1  });
						}
						var occupiedRight = this.checkForImpassablePixels( leadingRightEdge, true );
						var occupiedAbove = this.checkForImpassablePixels( leadingTopEdge, false );
						if ( occupiedRight || occupiedAbove ){
							var percentThroughPath = ( (x - x1)*(y - y2) ) / ((x2 - x1 ) * ( y1 - y2 ));
							if ( occupiedRight ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedAbove ){
								this.handleTopBottomCollision( mapObject, y );
							}
							return;
						}
					}
				}	
			}
		} else {
			if ( y2 >= y1 ){
				// x neg, y pos (down + left)
				for( x = x1; --x>=x2; ){
					for ( y = y1; y <= y2; y++){
						var leadingBottomEdge = [];
						var leadingLeftEdge = [];
						for( var i = 0; i < h; i++){
							leadingLeftEdge.push({ x: x - 1, y: y + i });
						}
						for( var i = 0; i < w; i++){
							leadingBottomEdge.push({ x: x+ i, y: y + h + 1  });
						}
						var occupiedLeft = this.checkForImpassablePixels( leadingLeftEdge, true );
						var occupiedBelow = this.checkForImpassablePixels( leadingBottomEdge, false );
						if ( occupiedLeft || occupiedBelow ){
							var percentThroughPath = ( (x - x2)*(y - y1) ) / ((x1 - x2 ) * ( y2 - y1 ));
							if ( occupiedLeft ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedBelow ){
								this.handleTopBottomCollision( mapObject, y );
							}
							return;
						}
					}
				}					
			} else {
				// x neg, y neg ( up + left )
				for( x = x1; --x>=x2; ){
					for ( y = y1; --y>=y2;){
						var leadingTopEdge = [];
						var leadingLeftEdge = [];
						for( var i = 0; i < h; i++){
							leadingLeftEdge.push({ x: x - 1, y: y + i });
						}
						for( var i = 0; i < w; i++){
							leadingTopEdge.push({ x: x+ i, y: y - 1  });
						}
						var occupiedLeft = this.checkForImpassablePixels( leadingLeftEdge, true );
						var occupiedAbove = this.checkForImpassablePixels( leadingTopEdge, false );
						if ( occupiedLeft || occupiedAbove ){
							var percentThroughPath = ( (x - x2)*(y - y2) ) / ((x1 - x2 ) * ( y1 - y2 ));
							if ( occupiedLeft ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedAbove ){
								this.handleTopBottomCollision( mapObject, y );
							}
							return;
						}
					}
				}					
			}
		}
		
	};
	/**
	 * Simply compares an array of pixel coordinates to the simple grid to detect if they are occupied
	 * @param pixels {array} - an array of x y coordinates to check
	 * @param lr {bool} - true if this is a rl wall (a column)
	 * @returns {bool} - true if any of the pixels are occupied
	 */
	Map.prototype.checkForImpassablePixels = function( pixels, lr ){
		for( i in pixels ){
			if ( lr ){
				if ( pixels[i].x < 0 || pixels[i].x > this.simpleGrid[0].length - 1){
					return true;
				}
			} else {
				if ( pixels[i].y < 0 || pixels[i].y > this.simpleGrid.length - 1 ){
					return true;
				}
			}
			if ( this.simpleGrid[ pixels[i].y ][ pixels[i].x ] ){
				return true; 
			}
		}
		return false;
	}
	Map.prototype.handleLeftRightCollision = function( mapObject, x ){
		// 1) flip destination coordinate to be ( current coordinate - remaining distance) * bounce
		var x2 = mapObject.x;
		var newX2 = x - ( x2 - x ) * mapObject.physics.bounce; 
		mapObject.x = newX2;		
		mapObject.vX *= -1 * mapObject.physics.bounce;
		// 2) add friction to crossing direction
		mapObject.vY *= ( 1 - settings.physics.surfaceFriction * mapObject.physics.friction );
		mapObject.view.setPos({
			x: mapObject.x, 
			y: mapObject.y
		});	
	}
	Map.prototype.handleTopBottomCollision = function( mapObject, y ){
		// 1) flip destination coordinate to be ( current coordinate - remaining distance) * bounce
		var y2 = mapObject.y;
		var newY2 = y - ( y2 - y ) * mapObject.physics.bounce; 
		mapObject.y = newY2;		
		mapObject.vY *= -1 * mapObject.physics.bounce;
		// 2) add friction to crossing direction
		console.log( settings.physics.surfaceFriction, mapObject.physics.friction );
		mapObject.vX *= ( 1 - settings.physics.surfaceFriction * mapObject.physics.friction );
		mapObject.view.setPos({
			x: mapObject.x, 
			y: mapObject.y
		});			
	}
	return Map; 
});
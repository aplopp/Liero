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

		this.impassibleGrid = this.getImpassibleGrid(); 
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
	// internal index variables to maybe speed things up
	Map.prototype.i = 0;
	Map.prototype.x = 0;
	Map.prototype.y = 0;
	/**
	 * simplifies the grid to a single 'type' number...whether the player (or objects) can pass through, or no. 
	 */
	var impassibleGrid = [];	
	Map.prototype.getImpassibleGrid = function(){
		for( var y = 0, lenY = this.grid.length; y < lenY; y++ ){
			impassibleGrid[ y ] = [];
			for( var x = 0, lenX = this.grid[0].length; x < lenX; x++ ){
				impassibleGrid[ y ].push( this.grid[y][x].type );
			}
		}
		return impassibleGrid; 
	};
	// creates an empty grid of -1,
	// same width and height as map,
	// on which to record object motion
	var cachedGrid = [];
	Map.prototype.getEmptyGrid = function(){
		if ( cachedGrid.length === 0 ){
			for( var y = 0, lenY = this.grid.length; y < lenY; y++ ){
				cachedGrid[ y ] = [];
				for( var x = 0, lenX = this.grid[0].length; x < lenX; x++ ){
					cachedGrid[ y ].push( -1 );
				}
			}
		}
		var emptyGrid = [];
		for (var i = 0, len = cachedGrid.length; i < len; i++)
		    emptyGrid[i] = cachedGrid[i].slice();	
		return emptyGrid;
	}
	/**
	 * Compares a mapObject to the map to see if its offscreen.
	 * @param  {object} mapObject
	 * @return {object} x, y - true, or a number (if offscreen)
	 */
	Map.prototype.isMapObjectOffMap = function( mapObject ){
		return {
			x: this.checkOffX( mapObject.x, mapObject.w ),
			y: this.checkOffY( mapObject.y, mapObject.h )
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
	Map.prototype.adjustForMapCollision = function( mapObject ){
		// handle collisions with static map
		this.handleMapCollision( mapObject );
	}
	Map.prototype.isEmpty = function( array ){
		for( var y = 0, lenY = array.length; y < lenY; y++ ){
			for( var x = 0, lenX = array[0].length; x < lenX; x++ ){
				if ( array[y][x] !== -1 ){
					return false;
				}
			}
		}
		return true;
	}
	Map.prototype.clearFrame = function(){
		this.frameGrid = this.getEmptyGrid();
	}
	Map.prototype.isObjectInOccupiedSpace = function( mapObject ){
		return {
			x: this.checkOffX( mapObject.x, mapObject.w ),
			y: this.checkOffY( mapObject.y, mapObject.h )
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
		var w = mapObject.w;
		var h = mapObject.h;

		// counter vars
		var y;
		var x;
		var i;
		var edgeR, edgeL, edgeT, edgeB, occupiedR, occupiedL, occupiedT, occupiedB;
		// this massive loop checks the leading edges for the 4 directions the mapObject could go.
		if ( x2 >= x1 ){
			if ( y2 >= y1 ){
				// both positive (down + right)
				for( x = x1; x <= x2; x++){
					for ( y = y1; y <= y2; y++){
						edgeR = [];
						edgeB = [];
						for( i = 0; i < h; i++){
							if ( ( y + i ) < ( this.canvas.height - 1 ) ){
								this.recordMotion( x + w, y + i, mapObject );
								edgeR.push({ x: x + w + 1, y: y + i });
							}
						}
						for( i = 0; i < w; i++){
							if ( ( x + i ) < ( this.canvas.width - 1 )){							
								this.recordMotion( x + i, y + h, mapObject );
								edgeB.push({ x: x+ i, y: y + h + 1  });
							}
						}
						occupiedR = this.checkForImpassablePixels( mapObject, edgeR, true );
						occupiedB = this.checkForImpassablePixels( mapObject, edgeB, false );
						if ( occupiedR || occupiedB ){
							// var percentThroughPath = ( (x - x1)*(y - y1) ) / ((x2 - x1 ) * ( y2 - y1 ));

							if ( occupiedR ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedB ){
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
						edgeT = [];
						edgeR = [];
						for( i = 0; i < h; i++){
							this.recordMotion( x + w, y + i, mapObject );
							edgeR.push({ x: x + w + 1, y: y + i });
						}
						for( i = 0; i < w; i++){
							this.recordMotion( x + i, y, mapObject );
							edgeT.push({ x: x+ i, y: y - 2  });
						}
						occupiedR = this.checkForImpassablePixels( mapObject, edgeR, true );
						occupiedT = this.checkForImpassablePixels( mapObject, edgeT, false );
						if ( occupiedR || occupiedT ){
							// var percentThroughPath = ( (x - x1)*(y - y2) ) / ((x2 - x1 ) * ( y1 - y2 ));
							if ( occupiedR ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedT ){
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
						edgeB = [];
						edgeL = [];
						for( i = 0; i < h; i++){
							this.recordMotion( x, y + i, mapObject );
							edgeL.push({ x: x - 1, y: y + i });
						}
						for( i = 0; i < w; i++){
							this.recordMotion( x + i, y + h, mapObject );
							edgeB.push({ x: x+ i, y: y + h + 1  });
						}
						occupiedL = this.checkForImpassablePixels( mapObject, edgeL, true );
						occupiedB = this.checkForImpassablePixels( mapObject, edgeB, false );
						if ( occupiedL || occupiedB ){
							// var percentThroughPath = ( (x - x2)*(y - y1) ) / ((x1 - x2 ) * ( y2 - y1 ));
							if ( occupiedL ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedB ){
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
						edgeT = [];
						edgeL = [];
						for( i = 0; i < h; i++){
							this.recordMotion( x, y + i, mapObject.id );
							edgeL.push({ x: x - 1, y: y + i });
						}
						for( i = 0; i < w; i++){
							this.recordMotion( x + i, y, mapObject.id );
							edgeT.push({ x: x+ i, y: y - 2  });
						}
						occupiedL = this.checkForImpassablePixels( mapObject, edgeL, true );
						occupiedT = this.checkForImpassablePixels( mapObject, edgeT, false );
						if ( occupiedL || occupiedT ){
							// var percentThroughPath = ( (x - x2)*(y - y2) ) / ((x1 - x2 ) * ( y1 - y2 ));
							if ( occupiedL ){
								this.handleLeftRightCollision( mapObject, x );
							}
							if ( occupiedT ){
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
	Map.prototype.checkForImpassablePixels = function( mapObject, pixels, lr ){

		for( var i =0, len = pixels.length; i<len;i++ ){

			if ( lr ){
				if ( pixels[i].x < 0 || pixels[i].x > ( this.impassibleGrid[0].length - 1 ) ){
					return true;
				}
			} else {
				if ( pixels[i].y < 0 || pixels[i].y > ( this.impassibleGrid.length - 1 ) ){
					return true;
				}
			}
			if ( ! this.impassibleGrid[ pixels[i].y ] ){
				return true;
			} else if ( this.impassibleGrid[ pixels[i].y ][ pixels[i].x ] === 1 ){
				return true; 
			}
		}
		return false;
	}
	Map.prototype.handleLeftRightCollision = function( mapObject, x ){
		// 1) flip destination coordinate to be ( current coordinate - remaining distance) * bounce
		mapObject.x = x - ( mapObject.x - x ) * mapObject.physics.bounce;	
		mapObject.lastPos.x = x;	
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
		mapObject.y = y - ( mapObject.y - y ) * mapObject.physics.bounce;
		mapObject.lastPos.y = y;
		mapObject.vY *= -1 * mapObject.physics.bounce;
		// 2) add friction to crossing direction
		mapObject.vX *= ( 1 - settings.physics.surfaceFriction * mapObject.physics.friction );
		mapObject.view.setPos({
			x: mapObject.x, 
			y: mapObject.y
		});			
	}
	Map.prototype.recordMotion = function( x, y, mapObject ){
		if ( mapObject.type === 'player' || mapObject.hitsPlayer ){
			if ( this.frameGrid[ y ] ){
				var val = this.frameGrid[y][x];
				if ( val === -1 ){
					this.frameGrid[y][x] = mapObject.id;
				} else if ( _.isNumber( val ) && val !== mapObject.id  ){
					this.frameGrid[y][x]  = [ this.frameGrid[y][x], mapObject.id ];
				}
			}
		}
	}	
	Map.prototype.handleObjectCollisions = function( ){
		var objectsWCollisions = [];
		for( var y = 0; y< this.frameGrid.length; y++ ){
			for( var x = 0; x< this.frameGrid[0].length; x++ ){
				if ( _.isArray( this.frameGrid[y][x] ) ){
					// if neither object is in any collisions so far.
					if ( _.difference( this.frameGrid[y][x], objectsWCollisions ).length == 2 ){
						this.executeObjectCollision( x, y, this.frameGrid[y][x][0], this.frameGrid[y][x][1]);
						// record to stop further collisions on these objects.
						objectsWCollisions = _.union( objectsWCollisions, this.frameGrid[y][x] );
					}
				}
			}
		}
	}
	Map.prototype.executeObjectCollision = function( x, y, mapObject1_id, mapObject2_id ){
		var mapObject1 = app.getObject( mapObject1_id );
		var mapObject2 = app.getObject( mapObject2_id );		
		if ( mapObject1.type === 'player' ){
			var player = mapObject1;
			var object = mapObject2;
		} else {
			var player = mapObject2;
			var object = mapObject1;
		}
		if ( object.hitsPlayer ){
			player.trigger( 'collision', object );
			object.trigger( 'collision', player )
		} else {
			console.log( 'no collision' );
		}
	}
	return Map; 
});
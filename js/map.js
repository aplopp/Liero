define([ 
	'underscore', 
	'backbone',
	'createjs',
	'settings',
	'functions/mapTypeDefinitions',
	'functions/ndarray'
], function( _, Backbone, createjs, settings, MapTypes, ndarray ){
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
	var impassibleGrid = false;	
	Map.prototype.getImpassibleGrid = function(){
		impassibleGrid = ndarray( new Int8Array( this.canvas.width * this.canvas.height ), [ this.canvas.width, this.canvas.height ] );;
		for( var y = 0, lenY = this.grid.length; y < lenY; y++ ){
			for( var x = 0, lenX = this.grid[0].length; x < lenX; x++ ){
				impassibleGrid.set( x, y, this.grid[y][x].type );
			}
		}
		return impassibleGrid; 
	};
	// creates an empty grid of -1,
	// same width and height as map,
	// on which to record object motion
	var emptyGrid = false;
	Map.prototype.getEmptyGrid = function(){
		emptyGrid = ndarray( new Int32Array( this.canvas.width * this.canvas.height ), [ this.canvas.width, this.canvas.height ] );
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
		// handle collisions with static map, record object motion
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
		this._frameCollisions = [];
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
		var y, x, cy, cx;
		var movingRight = x2 >= x1;
		var movingDown = y2 >= y1;

		// to start, record edges opposite of movement.
		cy = movingDown ? y1 : y1 + h;		
		for( cx = x1, lenX = x1 + w; cx<lenX; cx++ ){
			if ( cx < ( this.canvas.width - 1 ) && cy < ( this.canvas.height - 1 )){
				this.recordMotion( cx, cy, mapObject );
			}
		}
		cx = movingRight ? x1 : x1 + w;	
		for( cy = y1, lenY = y1 + h; cy<lenY; cy++ ){
			if ( cx < ( this.canvas.width - 1 ) && cy < ( this.canvas.height - 1 )){
				this.recordMotion( cx, cy, mapObject );
			}
		}	

	
		// this massive loop checks the leading edges 
		// for each pixel in the mapObject's path.
		if ( movingRight ){
			if ( movingDown ){
				// both positive (down + right)
				for( x = x1; x <= x2; x++){
					for ( y = y1; y <= y2; y++){
						if( ! this.handleMapObjectMove( mapObject, x, y, w, h, movingRight, movingDown ) ){
							return;
						}
					}
				}				
			} else {
				// x pos, y neg (up + right)
				for( x = x1; x <= x2; x++){
					for ( y = y1; --y>=y2;){
						if ( ! this.handleMapObjectMove( mapObject, x, y, w, h, movingRight, movingDown ) ){
							return;
						}
					}
				}	
			}
		} else {
			if ( movingDown ){
				// x neg, y pos (down + left)
				for( x = x1; --x>=x2; ){
					for ( y = y1; y <= y2; y++){
						if ( ! this.handleMapObjectMove( mapObject, x, y, w, h, movingRight, movingDown ) ){
							return;
						}
					}
				}					
			} else {
				// x neg, y neg ( up + left )
				for( x = x1; --x>=x2; ){
					for ( y = y1; --y>=y2;){
						if( ! this.handleMapObjectMove( mapObject, x, y, w, h, movingRight, movingDown ) ){
							return;
						}
					}
				}					
			}
		}
		 
	};

	Map.prototype._horizontalEdge = [];
	Map.prototype._verticalEdge = [];
	Map.prototype._occupiedHorizontal = [];
	Map.prototype._occupiedVertical = [];
	Map.prototype.handleMapObjectMove = function( mapObject, x, y, w, h, movingRight, movingDown){
		this._horizontalEdge = [];
		this._verticalEdge = [];
		var cx, cy, lenX, lenY;
		// above top or below bottom
		var tbEdge = movingDown ? y + h : y;
		var lrEdge = movingRight ? x + w : x ;				
			
		// left-right collisions
		cx = movingRight ? lrEdge + 1 : lrEdge - 1;
		for( cy = y, lenY = y + h; cy<lenY; cy++ ){
			if ( cx < ( this.canvas.width - 1 ) && cy < ( this.canvas.height - 1 )){
				this.recordMotion( cx, cy, mapObject )
			}
			this._horizontalEdge.push({ x: cx, y: cy });
		}	
		this._occupiedHorizontal = this.checkForImpassablePixels( mapObject, this._horizontalEdge, true );

		// top-bottom collisions
		cy = movingDown ? tbEdge + 1 : tbEdge - 1;
		for( cx = x, lenX = x + w; cx<lenX; cx++ ){

			if ( cx < ( this.canvas.width - 1 ) && cy < ( this.canvas.height - 1 )){
				this.recordMotion( cx, cy, mapObject );
			}
			this._verticalEdge.push({ x: cx, y: cy });
		}	
		this._occupiedVertical = this.checkForImpassablePixels( mapObject, this._verticalEdge, false );
		if ( this._occupiedHorizontal || this._occupiedVertical ){
			if ( this._occupiedHorizontal ){
				this.handleHorizontalCollision( mapObject, x, movingRight );
			}
			if ( this._occupiedVertical ){
				this.handleVerticalCollision( mapObject, y, movingDown );
			}
			return false;
		}
		return true;
	}	

	/**
	 * Simply compares an array of pixel coordinates to the simple grid to detect if they are occupied
	 * @param pixels {array} - an array of x y coordinates to check
	 * @param lr {bool} - true if this is a rl wall (a column)
	 * @returns {bool} - true if any of the pixels are occupied
	 */
	Map.prototype.checkForImpassablePixels = function( mapObject, pixels, lr ){

		for( var i =0, len = pixels.length; i<len;i++ ){

			// off map on x or y axis, depending on direction
			if ( lr ){
				if ( pixels[i].x < 0 || pixels[i].x > ( this.grid[0].length - 1 ) ){
					return true;
				}
			} else {
				if ( pixels[i].y < 0 || pixels[i].y > ( this.grid.length ) ){
					return true;
				}
			}
			var type = MapTypes.get( this.impassibleGrid.get( pixels[i].x, pixels[i].y ) );
			if ( mapObject.type === 'player' && type.blockPlayer ){
				return true; 
			} else if ( mapObject.type === 'projectile' && type.blockShot ){
				return true;
			}
		}
		return false;
	}
	Map.prototype.handleHorizontalCollision = function( mapObject, x, movingRight ){
		mapObject.x = x - ( mapObject.x - x ) * mapObject.physics.bounce;
		// adjust to collide with the pixel prior to actually overlapping.
		if ( movingRight ){
			if ( mapObject.x > (x - 1) ) mapObject.x = x - 1;
		} else {
			if ( mapObject.x < (x + 1) ) mapObject.x = x + 1;			
		}
		mapObject.trigger( 'mapCollision', mapObject.x, mapObject.y );

		// failsafe
		if ( mapObject.x > (this.canvas.width - 1) ) mapObject.x = ( this.canvas.width - 1 );
		if ( mapObject.x < 0 ) mapObject.x = 0;

		mapObject.lastPos.x = x;
		// reverse velocity and multiply by bounce
		mapObject.vX *= -1 * mapObject.physics.bounce;
		// add friction to crossing direction
		mapObject.vY *= ( 1 - settings.physics.surfaceFriction * mapObject.physics.friction );
		if ( Math.abs( mapObject.vX ) < 20 ){
			mapObject.vX = 0;
		}
		mapObject.view.setPos({
			x: mapObject.x
		});	
	}
	Map.prototype.handleVerticalCollision = function( mapObject, y, movingDown ){
		mapObject.y = y - ( mapObject.y - y ) * mapObject.physics.bounce;
		// adjust to collide with the pixel prior to actually overlapping.
		if ( movingDown ){
			if ( mapObject.y > (y - 1) ) mapObject.y = y - 1;
		} else {
			if ( mapObject.y < (y + 1) ) mapObject.y = y + 1;
		}
		mapObject.trigger( 'mapCollision', mapObject.x, mapObject.y );

		// failsafe
		if ( mapObject.y > ( this.canvas.height ) ) mapObject.y = this.canvas.height;
		if ( mapObject.y < 0 ) mapObject.y = 0;
		
		mapObject.lastPos.y = y;
		// reverse velocity and multiply by bounce
		mapObject.vY *= -1 * mapObject.physics.bounce;
		// add friction to crossing direction
		mapObject.vX *= ( 1 - settings.physics.surfaceFriction * mapObject.physics.friction );
		if ( Math.abs( mapObject.vY ) < 40 ){
			mapObject.vY = 0;
		}

		mapObject.lastPos.y = y;
		mapObject.view.setPos({
			y: mapObject.y
		});	
	}
	Map.prototype.recordMotion = function( x, y, mapObject ){
		if ( mapObject.type === 'player' ){
			this.frameGrid.set( x, y, mapObject.id );
		} else if ( mapObject.hitsPlayer ){	
			var val = this.frameGrid.get( x, y );
			if ( val && val !== mapObject.id  ){
				this.executeObjectCollision( x, y, val, mapObject.id );
			}
		}
	}	
	// tracker variables
	Map.prototype._mo1 = false;
	Map.prototype._mo2 = false;
	Map.prototype._p = false;
	Map.prototype._o = false;
	Map.prototype._frameCollisions = [];
	Map.prototype.executeObjectCollision = function( x, y, mapObject1_id, mapObject2_id ){

		this._mo1 = app.getObject( mapObject1_id );
		this._mo2 = app.getObject( mapObject2_id );

		if ( ! ( this._mo1 && this._mo2 ) )	return;
		// both players
		if ( this._mo1.type === 'player' && this._mo2.type === 'player'){
			return; // disable collisions
		// both non-players
		} else if (this._mo1.type !== 'player' && this._mo2.type !== 'player' ){
			return; // disable collisions
		} 
		this._frameCollisions.push( this._p.id, this._o.id );


		if ( this._mo1.type === 'player' ){
			this._p = this._mo1; 
			this._o = this._mo2;
		} else {
			this._o = this._mo1; 
			this._p = this._mo2;
		}
		if ( _.indexOf( this._frameCollisions, this._o.id ) !== -1 ){
			// the object has already had a collision this frame
			return;
		}	

		// handle player intersecting object
		if ( ! this._o.hitsPlayer ){
			return; // no collision if object doesn't hit player
		}
		
		this._p.trigger( 'objectCollision', this._o, x, y );			
		this._o.trigger( 'objectCollision', this._o, x, y );
	}
	return Map; 
});
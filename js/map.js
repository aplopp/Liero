define([ 
	'underscore', 
	'backbone',
	'createjs',
], function( _, Backbone, createjs ){
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

	return Map; 
});
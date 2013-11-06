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
	}
	return Map; 
});
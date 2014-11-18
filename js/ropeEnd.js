define([
	'underscore',
	'backbone',
	'createjs',
	'classes/mapObject',
	'models/ropeEnd',
	'views/ropeEnd',
], function( _, Backbone, createjs, MapObject, RopeEndM, RopeEndV ){
	var RopeEnd = MapObject.extend({
		/**
		 * the eventBinding states which functions to call for which events
		 * to trigger events on key stroke, events should match the playerSpec.keybindings events
		 * @type {Object}
		 */
		eventBinding: {
		},
		initialize: function( spec ){
			var that = this;

	        this.type = 'ropeEnd';
			this.model = new RopeEndM( spec.model );
			this.view = new RopeEndV({ model: this.model });

			this.on( 'objectCollision', function( mapObject, x, y ){
				if ( mapObject.type === 'player' ){

				}
			});
			this.on( 'mapCollision', function( x, y ){
				
			});
		},
	});

	return RopeEnd;
});
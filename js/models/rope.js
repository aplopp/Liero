define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'settings',
	'ropeEnd',
	'functions/math'
], function( _, Backbone, createjs, settings, RopeEnd, MathFunctions ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var RopeM = Backbone.Model.extend({
		defaults: {
			holdingPlayer: false,
			launchSpeed: 500, // pixels/s
			color: '#fff',
			width: 2, 
			launchDistanceFromCenter: 10, 
			end: false,
			_launched: false
		},
		initialize: function(){	
			this.set( 'holdingPlayer', this.get( 'holdingPlayer' ).id ); // reduce to simple ID for reference
			this.set( 'end', new RopeEnd( this.get('end') ));
		},
		getHoldingPlayer: function(){
			return app.players[ this.get( 'holdingPlayer' ) ];
		},		
		_endOnMap: false,
		launch: function(){
			if ( ! this._endOnMap ){
				app.addObject( this.get( 'end' ) );	
				this._endOnMap = true;
			}			
			var player = this.getHoldingPlayer();
			var xDir = player.model.get( 'facing' ) === 'left' ? -1 : 1;
			var aim = player.model.get( 'aim' );

			var launchCoords = MathFunctions.getPointOnCircle( player.x + player.w/2, player.y + player.h/2, this.get( 'launchDistanceFromCenter' ), xDir * aim );
			var launchVelocities = MathFunctions.getVelocityComponents( this.get( 'launchSpeed' ),  - xDir * aim );
			var ropeEnd = this.get( 'end' );
			ropeEnd.x = launchCoords.x;
			ropeEnd.y = launchCoords.y;
			ropeEnd.vX = launchVelocities.x;
			ropeEnd.vY = launchVelocities.y;

			app.addObjectToMap( ropeEnd );
			this.set( '_launched', true )
			// get the velocities by finding the point at the right aim on a circle of radius speed.
	
		}	
	}); 
	return RopeM;
});
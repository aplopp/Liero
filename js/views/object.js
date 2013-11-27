define([ 
	'settings',
	'underscore', 
	'backbone',
	'createjs'
], function( settings, _, Backbone, createjs ){
	var Object = function( objectSpec ){
		var objectSpec = {
			type: 'bullet', 
			
		}
		this.model = new ObjectM( objectSpec.model );
		this.view = new ObjectV({ model: this.model });;
		this.vX = 0; // velocity in px/s
		this.vY = 0; // velocity in px/s
		this.isSupported = false;

	}
	var p = Object.prototype;
	p.nextPosition = function(){
		this.model.set( 'y', this.model.get( 'y' ) + this.vY/settings.FPS );
		this.model.set( 'x', this.model.get( 'x' ) + this.vX/settings.FPS );

		if ( ! this.isSupported ){
			this.vY += settings.physics.gravity/settings.FPS; 
		} else if ( this.vX ){
			if ( this.vX < 1 ){
				this.vX = 0; 				
			}
			this.vX *= ( 1 - settings.physics.groundFriction/settings.FPS );			
		}
		this.vY *= ( 1 - settings.physics.airFriction/settings.FPS );
		this.vX *= ( 1 - settings.physics.airFriction/settings.FPS );
	}

	return Player;
});
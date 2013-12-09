define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'settings',
	'projectile', 
	'functions/math',
	'functions/color'
], function( _, Backbone, createjs, settings, Projectile, MathFunctions, ColorFunctions ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var count = 0;
	var WeaponM = Backbone.Model.extend({
		defaults: {
			name: 'Weapon Name', 
			reload: 1, // shots/s
			recoil: 100, // pixels/s
			speed: 500, // pixels/s
			projectile: 'bullet',
			auto: false,
			holdingPlayer: false,
			color: '#fff',
			length: 10,
			width: 2
		},
		launchProjectile: function(){
			var player = app.players[ this.get( 'holdingPlayer' ) ] ;
			var xDir = player.model.get( 'facing' ) === 'left' ? -1 : 1;
			var aim = player.model.get( 'aim' );

			// find end of barrel.
			var barrelCoords = MathFunctions.getPointOnCircle( player.model.get( 'width' )/2, player.model.get( 'height' )/2, this.get('length'), xDir * aim );
			// get the velocities by finding the point at the right aim on a circle of radius speed.
			var velocities = MathFunctions.getPointOnCircle( 0, 0, this.get( 'speed' ), xDir * aim );

			var projectile = new Projectile({
				// e nd of barrel coordinates
				x: player.x + barrelCoords.x, // TODO, end of barrel
				y: player.y + barrelCoords.y, // TODO, end of barrel
				// x/y components of speed, depending on angle of barrel
				vX: velocities.x + player.vX,
				vY: velocities.y + player.vY,
				model: this.get('projectile')
			});
			app.addObject( projectile );
		},
		_delay: false,
		fire: function(){
			var that = this;
			// set a delay that expires in 1s/reload. 
			if ( ! this._delay ){
				this._delay = true;
				setTimeout( function(){
					that._delay = false;
				}, 1000/this.get('reload') );

				console.log( count++, this.get( 'name' ) + ': fired ' + this.get( 'projectile' ).name );
				this.launchProjectile();
			} else {
				console.log( this.get( 'name' ) + ': too soon to fire ')
			}
		},
		_shooting: false,
		startShooting: function(){
			var that = this;			
			if ( ! this.get( 'auto' )){
				this.fire();
			} else {
				that.fire();
				this._shooting = setInterval( function(){
					that.fire();
				// delay slighly higher than required delay to make sure it fires after delay from previous .fire() expires					
				}, 1030/this.get( 'reload' ) ); 
			}
		},
		stopShooting: function(){
			clearInterval( this._shooting );
		},
		initialize: function(){
			// change explosion spec to right format
			var projectile = this.get( 'projectile' );
			if ( _.isString( projectile )){
				this.set( 'projectile', $.extend( {}, settings.projectiles[ projectile ] ) );
			}
		}		
	}); 
	return WeaponM;
});
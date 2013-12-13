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
			speed: 500, // pixels/s
			speedVariability: 0,
			projectile: 'bullet',
			auto: false,
			recoil: 100, // pixels/s
			scatter: 0, // scatter of initial launch in degrees from tip of barrel, max 90
			holdingPlayer: false,
			perShot: 1,
			color: '#fff',
			length: 10,
			width: 2,
		},
		launchProjectile: function(){
			var player = this.getHoldingPlayer();
			var xDir = player.model.get( 'facing' ) === 'left' ? -1 : 1;
			var aim = player.model.get( 'aim' );

			// find end of barrel.
			var barrelCoords = MathFunctions.getPointOnCircle( player.model.get( 'width' )/2, player.model.get( 'height' )/2, this.get('length'), xDir * aim );
			// get the velocities by finding the point at the right aim on a circle of radius speed.

			var scatter = this.get( 'scatter' );
			var speedVariability = this.get( 'speedVariability');
			var projectileSpec = this.get( 'projectile' );


			for( i = 0; i < this.get( 'perShot'); i++ ){
				var randSpeedDiff = speedVariability ? MathFunctions.getRandomNumberBetween( - speedVariability/2, speedVariability/2 ) : 0;
				var randScatter = scatter ? MathFunctions.getRandomNumberBetween( - scatter/2, scatter/2 ) : 0;
				// set aim
				projectileSpec.aim = xDir * ( aim + randScatter );

				var launchVelocities = MathFunctions.getVelocityComponents( this.get( 'speed' ) + randSpeedDiff, projectileSpec.aim );

				var projectile = new Projectile({
					// e nd of barrel coordinates
					x: player.x + barrelCoords.x, // TODO, end of barrel
					y: player.y + barrelCoords.y, // TODO, end of barrel
					// x/y components of speed, depending on angle of barrel
					vX: launchVelocities.x,
					vY: launchVelocities.y,
					physics: projectileSpec.physics, 
					model: projectileSpec.onLaunch( projectileSpec.model, this )
				});
				// if affected by player motion
				projectile.vX += player.vX;
				projectile.vY += player.vY;
				
				app.addObject( projectile );
			}
			if ( recoil = this.get( 'recoil' )){
				var recoilVelocities = MathFunctions.getVelocityComponents( recoil, xDir * ( aim - 180 ) );
				player.vX += recoilVelocities.x;
				player.vY += recoilVelocities.y;
			}
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

				console.log( count++, this.get( 'name' ) + ': fired ' + this.get('perShot') +' '+ this.get( 'projectile' ).model.name );
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
		getHoldingPlayer: function(){
			return app.players[ this.get( 'holdingPlayer' ) ];
		},
		initialize: function(){
			// change explosion spec to right format
			var projectile = this.get( 'projectile' );
			if ( _.isFunction( projectile )){
				projectile = projectile( this );
			}

			var requiredProps = { onLaunch: function( projectile ){ return projectile; } };
			if ( _.isString( projectile )){
				this.set( 'projectile', $.extend( {}, requiredProps, settings.projectiles[ projectile ] ) );
			} else if ( _.isString( projectile.modifies ) ){
				var baseProjectile = settings.projectiles[ projectile.modifies];
				delete projectile.modifies;
				this.set( 'projectile', $.extend( {}, requiredProps, baseProjectile, projectile ) );
			}
			if ( this.get( 'scatter' ) > 90 ){
				this.set( 'scatter', 90 );
			}
			if ( this.get( 'perShot' ) > 50 ) {
				this.set( 'perShot', 50 );				
			} else if ( this.get( 'perShot' ) < 1 ){
				this.set('perShot', 1 );
			}		
			this.set( 'holdingPlayer', this.get( 'holdingPlayer' ).id ); // reduce to simple ID for reference
	
		},
		validate: function( attrs, options ){
			if( attrs.scatter > 90 ){
				return this.get( 'name' ) + ': Outside accepted limits for scatter.'; 
			}
			if( attrs.perShot > 50 || attrs.perShot < 1 ){
				return this.get( 'name' )+ ': PerShot must be between 1 and 50'; 
			}			
		}		
	}); 
	return WeaponM;
});
define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'settings',
	'projectile'
], function( _, Backbone, createjs, settings, Projectile ){
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

			holdingPlayer: false
		},
		launchProjectile: function(){
			var player = app.players[ this.get( 'holdingPlayer' ) ] ;
			var projectile = new Projectile({
				// end of barrel coordinates
				x: player.x, // TODO, end of barrel
				y: player.y, // TODO, end of barrel
				// x/y components of speed, depending on angle of barrel
				vX: this.get( 'speed' ) + player.vX,
				vY: player.vY,
				model: settings.projectiles[ this.get('projectile') ]
			});
			console.log( projectile ); 
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

				console.log( count++, this.get( 'name' ) + ': fired ' + this.get( 'projectile' ) );
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
		}		
	}); 
	return WeaponM;
});
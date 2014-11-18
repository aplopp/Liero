define([
	'underscore',
	'backbone',
	'createjs',
	'models/weapon',
	'models/rope'
], function( _, Backbone, createjs, WeaponM, RopeM ){
	/**
	 * maintains a model of the properties affecting the drawing of the object.
	 * the view listens to these changes and adjusts the rendering accordingly
	 */
	var PlayerM = Backbone.Model.extend({
		defaults: {
			// personal properties
			color: '#666',
			facing: 'left',
			aim: 0, // -45 to 90
			moving: 0, // -1, 0, or 1
			jumpPower: 0,
			moveSpeed: 0,
			health: 0,
			totalHealth: 100,
			delayTilRespawn: 3000,
			dead: false,
			lastHitBy: false,
			deaths: 0,
			kills: 0,
			suicides: 0,
			digDepth: 3,
			weapons: [],
			activeWeapon: 0,
			rope: false,
			_ropeIsLaunched: false
		},
		getActiveWeapon: function(){
			this.get( 'weapons')[ this.get('activeWeapon') ];
			return this.get( 'weapons')[ this.get('activeWeapon') ];
		},
		initialize: function( atts, id ){
			var that = this;
			// convert weaponIDs into weaponModels
			var weaponIDs = this.get('weapons');
			var weapons = [];
			_.each( weaponIDs, function(weaponID){
				var weaponSpec = settings.weapons[ weaponID ];
				weaponSpec.holdingPlayer = that;
				weaponSpec.id = 'p' + that.id + '-' + weaponID;
				weapons.push( new WeaponM( weaponSpec ) );
			});
			this.set( 'weapons', weapons );

			this.set( 'health', this.get('totalHealth') );
			var ropeSpec = this.get( 'rope' );
			ropeSpec.holdingPlayer = this;
			this.set( 'rope', new RopeM( ropeSpec ) );

		},
		validate: function( attrs, options ){
			if( attrs.aim < 0 || attrs.aim > 135 ){
				return 'Outside accepted limits for range';
			}
		}
	});
	return PlayerM;
});
define([ 
	'underscore', 
	'backbone',
	'createjs', 
	'models/weapon',
	'settings'
], function( _, Backbone, createjs, WeaponM, settings ){
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
			bounce: .8, 
			weapons: [],
			activeWeapon: 0,
			x: 0, 
			y: 0
		},
		getActiveWeapon: function(){
			return this.get( 'weapons')[ this.get('activeWeapon') ];
		},
		initialize: function(){
			// convert weaponIDs into weaponModels
			var weaponIDs = this.get('weapons'); 
			var weapons = [];
			_.each( weaponIDs, function(weaponID){
				var weaponSpec = settings.weapons[ weaponID ];
				weapons.push( new WeaponM( weaponSpec) );
			});
			this.set( 'weapons', weapons );
		},		
		validate: function( attrs, options ){
			if( attrs.aim < 0 || attrs.aim > 135 ){
				return 'Outside accepted limits for range'; 
			}
		}			
	}); 
	return PlayerM;
});
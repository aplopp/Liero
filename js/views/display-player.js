define([ 
	'underscore', 
	'jquery',	
	'backbone', 
	'text!templates/display-player-full.tpl',
	'views/display-weapon-full'
], function( _, $, Backbone, FullTemplate, FullWeaponDisplayV ){
	var DisplayPlayerV = Backbone.View.extend({
		tagName: 'div',
		className: 'player-display',
		initialize: function(){
			var that = this;
			this.listenTo( this.model, 'change', function(){
				that.render( that.model.changed );
			}); 
			var attributes = this.model.attributes;
			this.$el.html( _.template( FullTemplate, attributes ) );
			this.$weapons = this.$el.find( '.weapons' );
			_.each( this.model.get( 'weapons' ), function( weapon ){
				var weaponV = new FullWeaponDisplayV({ model: weapon });
				that.$weapons.append( weaponV.$el );
			});
			this.render();
		},
		/** render the model to the canvas as a shape */
		render: function( changed ){
			if ( ! changed ){
				changed = this.model.attributes
			}
			// set up the shape
			for( prop in changed ){
				var $field = this.$el.children( '.' + prop ).children( '.value');
				if ( $field.size() > 0 ){
					$field.html( changed[prop] );
				}
			}
			if ( _.has( changed, 'dead' )){
				this.$el.toggleClass( 'dead', changed.dead );
			}
			if ( _.has( changed, 'activeWeapon' ) ){
				this.$weapons.find( '.weapon-display.active-weapon' ).removeClass('active-weapon');

				this.$weapons.find( '.weapon-display' ).eq( changed.activeWeapon ).addClass('active-weapon');
			} 
		}
	}); 
	return DisplayPlayerV;
});
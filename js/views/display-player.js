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
			this.$name = this.$el.find( '.name .value' );
			this.$width = this.$el.find( '.width .value' );
			this.$height = this.$el.find( '.height .value' );
			this.$aim = this.$el.find( '.aim .angle' );
			this.$weapons = this.$el.find( '.weapons' );
			this.$totalHealth = this.$el.find( '.health .total' );
			this.$health = this.$el.find( '.health .current' );
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
			if ( _.has( changed, 'name' ) ){
				this.$name.html( changed.name )
			} 
			if ( _.has( changed, 'health' ) || _.has( changed, 'totalHealth' ) ){
				if ( _.has( changed, 'health' ) ){
					this.$health.html( changed.health );
				}
				if ( _.has( changed, 'totalHealth' ) ){
					this.$totalHealth.html( changed.totalHealth );
				}
			}
			if ( _.has( changed, 'width' ) ){
				this.$width.html( changed.width )
			} 
			if ( _.has( changed, 'height' ) ){
				this.$height.html( changed.height )
			} 
			if ( _.has( changed, 'aim' ) || _.has( changed, 'facing' ) ){
				var aim = this.model.get( 'facing' ) === 'left' ? '-'+ this.model.get( 'aim' ) : this.model.get( 'aim' );
				this.$aim.html( aim );
			} 
			if ( _.has( changed, 'activeWeapon' ) ){
				this.$weapons.find( '.weapon-display.active-weapon' ).removeClass('active-weapon');

				this.$weapons.find( '.weapon-display' ).eq( changed.activeWeapon ).addClass('active-weapon');
			} 
		}
	}); 
	return DisplayPlayerV;
});
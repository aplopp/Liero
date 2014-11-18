define([
	'underscore',
	'jquery',
	'backbone',
	'text!templates/display-weapon-full.tpl'
], function( _, $, Backbone, FullTemplate ){
	var FullWeaponDisplayV = Backbone.View.extend({
		tagName: 'div',
		className: 'player-display',
		initialize: function(){
			var that = this;
			this.listenTo( this.model, 'change', function(){
				that.render( that.model.changed );
			});
			var attributes = this.model.attributes;
			this.$el.html( _.template( FullTemplate, attributes ) );
		},
		/** render the model to the canvas as a shape */
		render: function( changed ){
			if ( ! changed ){
				changed = this.model.attributes
			}
			for( prop in changed ){
				var $field = this.$el.find( '.' + prop + ' > .value');
				if ( $field.size() > 0 ){
					$field.html( changed[prop] );
				}
			}
		}
	});
	return FullWeaponDisplayV;
});
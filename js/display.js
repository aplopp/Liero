define([
	'underscore',
	'backbone',
	'views/display-player',
	'keys'
], function( _, Backbone, PlayerDisplayV, keys ){
	var Display = function( app ){
		var that = this;
		this.$el = $( '#'+app.settings.displayID );
		
		this.players = {};
		_.each( app.players, function( player ){
			var playerV = new PlayerDisplayV({ model: player.model });
			that.players[ player.id ] = playerV;
			that.$el.append( playerV.$el );
		});
	}
	return Display;
});
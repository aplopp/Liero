define([ 'underscore', 'backbone', 'settings', 'keys' ], function( _, Backbone, settings, keys ){
	var id = 0;
	function prefixEventName( event ){
		return 'mo-'+id+'-' + event ;
	}	
	var MapObject = function( options ){
		this.id = id++;		
		this.routeKeyPresses();
		this.initialize( options );
	}
	var p = _.extend( MapObject.prototype, {
		model: null, 
		view: null,
		vX: 0,
		vY: 1000,
		x: 0, 
		y: 0,
		id: 0,
		initialize: function( options ){
			// implemented by children
		},
		nextPosition:  function(){
			if ( acceleration = this.model.get('acceleration')){
				this.vX += acceleration.x;
				this.vY += acceleration.y;
			}
			this.x += this.vX/settings.FPS;
			this.y += this.vY/settings.FPS;		

			this.view.setPos({
				x: this.x, 
				y: this.y
			});


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
		}, 
		prefixEventName: function( eventName ){
			return 'mo-'+id+'-' + eventName ;
		},
		routeKeyPresses: function(){
			var that = this;
			_.each( this.eventBinding, function( functionName, eventName ){
				keys.on( that.prefixEventName( eventName ), function(){
					that[ functionName ]();
				});
			});
		}
	});
	MapObject.extend = Backbone.Model.extend; // just borrow the extend function
	return MapObject; 
});
define([
	'underscore',
	'backbone',
	'keys',
	'functions/math'
], function( _, Backbone, keys, MathFunctions ){
	var id = 1;
	function prefixEventName( event ){
		return 'mo-'+id+'-' + event ;
	}
	var MapObject = function( options ){
		this.id = id++;
		this.routeKeyPresses();
		this.x = _.has(options, 'x') ? options.x : 0;
		this.y = _.has(options, 'y') ? options.y : 0;
		this.vX = _.has(options, 'vX') ? options.vX : 0;
		this.vY = _.has(options, 'vY') ? options.vY : 0;
		this.w = _.has(options, 'width') ? options.width : 2;
		this.h = _.has(options, 'height') ? options.height : 2;
		this.weight = _.has( options, 'weight' ) ? options.weight: 10;
		this.type = _.has(options, 'type') ? options.type : false;
		this.hitsPlayer = _.has(options, 'hitsPlayer') ? !! options.hitsPlayer : false;
		var defaultPhysics = {
			friction: 0,
			gravity: 1,
			bounce: .8,
			acceleration: false
		};
		if ( _.has( options, 'physics' )){
			this.physics = _.extend( defaultPhysics, options.physics );
		} else {
			this.physics = defaultPhysics;
		}
		if ( this.physics.acceleration ){
			// set up acceleration to accelerate in direction of initial launch
			this.physics.acceleration = MathFunctions.getVelocityComponents( this.physics.acceleration, MathFunctions.getAngleFromVelocities( this.vX, this.vY ) ) ;
		} else {
			this.physics.acceleration = { x: 0, y: 0 };
		}

		this.initialize( _.omit( options, [ 'weight', 'type', 'hitsPlayer', 'x', 'y', 'vX', 'vY', 'physics', 'width', 'height' ] ) );
	
		this.nextPosition();

	}
	var p = _.extend( MapObject.prototype, {
		model: null,
		view: null,
		vX: 0,
		vY: 1000,
		x: 0,
		y: 0,
		w: 2,
		h: 2,
		physics: {
			gravity: 1,
			friction: 0,
			bounce: .8,
			acceleration: 0
		},
		// sticky: 0,
		id: 0,
		initialize: function( options ){
			// implemented by children
		},
		nextPosition:  function(){
			// record current position for easy reference in collisions
			this.lastPos = {
				x: this.x,
				y: this.y,
				vX: this.vX,
				vY: this.vY
			};

			/* ---- update velocities for next frame -------------------------------------- */
			// universal gravity * special gravity
			this.vY += this.physics.gravity * settings.physics.gravity/settings.FPS;

			// special acceleration
			if( this.physics.acceleration ){
				this.vX += this.physics.acceleration.x;
				this.vY += this.physics.acceleration.y;
			}
			
			// universal friction * special friction
			this.vY *= ( 1 - this.physics.friction * settings.physics.airFriction/settings.FPS );
			this.vX *= ( 1 - this.physics.friction * settings.physics.airFriction/settings.FPS );

			/* ---- advance position based on velocity -------------------------------------- */
			this.x += this.vX/settings.FPS;
			this.y += this.vY/settings.FPS;
	
			this.view.setPos({
				x: this.x,
				y: this.y
			});
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
	_.extend(MapObject.prototype, Backbone.Events);
	MapObject.extend = Backbone.Model.extend; // just borrow the extend function
	return MapObject;
});
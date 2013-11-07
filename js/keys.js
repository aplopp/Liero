define([ 
	'underscore', 
	'backbone',
	'jquery'
], function( _, Backbone, $ ){
	// the keyBindings, with keys and values flipped for easier reference
	var keyBindingsFlipped;


	var Keys = function( keyBindings ){
		var that = this; 
		

		var _bindings = {}
		/**
		 * function to set multiple key bindings at once
		 * @param {object} keyBindings
		 */
		this.setBindings = function( updatedKeyBindings ){
			if ( _.isObject( updatedKeyBindings ) ){
				// merges old with new, replacing where conficting
				_bindings = _.extend( _bindings, updatedKeyBindings );
				return _bindings;
			}
			console.log( 'keys.setBindings() needs an object');
			return false;
		}
		/**
		 * function to set one key binding
		 * @param {string} action
		 * @param {int|array} keyCode(s)
		 */		
		this.setBinding = function( action, keyCode ){
			if ( _.isString( action ) && ( _.isNumber(keyCode) || _.isArray( keyCode ) ) ){
				_bindings[ action ] = keyCode;
				return _bindings; 
			}
			console.log( 'keys.setBindings() needs a string, and then a keycode');
			return false; 
		}
		// support events
		_.extend(this, Backbone.Events); 

		/** array of currently pressed keys
		  * @private
		  */
		var currentlyPressed = [];

		/**
		 * add key to array
		 * @param {int} keyCode
		 */
		this.pressKey = function( keyCode ){
		    if ( currentlyPressed.indexOf( keyCode ) === -1 ){
		    	currentlyPressed.push( keyCode ); 
		    }
		}
		/**
		 * remove key from array
		 * @param {int} keyCode
		 */
		this.unPressKey = function( keyCode ){
			currentlyPressed.splice( currentlyPressed.indexOf( keyCode ), 1 ); 
		}			
		/** get array of currently pressed keys */
		this.getPressed = function(){
			return currentlyPressed;
		}
		this.isPressed = function( keyCode ){
		    if ( currentlyPressed.indexOf( keyCode ) !== -1 ){
		    	return true;
		    }			
		    return false;
		}
		this.triggerActions = function(){
			_.each( this.get(), function( keyCode ){
		    	// that.trigger( 'keyAction', _bindings[keyCode] );
			});			
		}
		/**
		 * Kick it off by tying it to the document 'onkeydown' and 'onkeyup' functions
		 */
		var init = function(){
			document.onkeydown = function(e){
				that.pressKey( e.keyCode );
			}
			document.onkeyup = function(e){
				that.unPressKey( e.keyCode );
			}
			that.setBindings( keyBindings );
			that.setBinding ( 'hello', [36, 37] );
			console.log( _bindings );
			return that;
		}
		init();
	}

	var init = function( keyBindings ){
		var pressedKeys = new Keys( keyBindings );
		return pressedKeys; 
	}
	return { init: init }
	
});
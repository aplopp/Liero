define([ 
	'underscore', 
	'backbone',
	'jquery'
], function( _, Backbone, $ ){
	// the keyBindings, with keys and values flipped for easier reference
	var keyBindingsFlipped;


	var Keys = function( keyBindings ){
		var that = this; 
		

		/**
		 * holds a reference to all keys with actions 
		 * NOTE: special keys - 'cmd', 'ctrl', 'alt', 'shift'
		 */
		var _bindings = {};
		var _multiKeyBindings = {};
		/**
		 * function to set multiple key bindings at once
		 * @param {object} keyBindings
		 */
		this.setBindings = function( updatedKeyBindings ){
			if ( _.isObject( updatedKeyBindings ) ){
				var flipped = _.invert( updatedKeyBindings ); 

				// merges old with new, replacing where conficting
				_bindings = _.extend( _bindings, flipped );
				return _bindings;
			}
			console.log( 'keys.setBindings() needs an object');
			return false;
		}
		/**
		 * function to set one key binding
		 * @param {string} action
		 * @param {int|string} keyCode(s)
		 */		
		this.setBinding = function( action, keyCode ){
			if ( _.isString( action ) ){
				if ( _.isNumber(keyCode) || that.isModifierKey( keyCode ) ){
					_bindings[ keyCode ] = action;
					return _bindings; 
				}
			}
			console.log( 'keys.setBindings() needs a string, and then a keycode');
			return false; 
		}
		var _modKeys = [ 'command', 'control', 'shift', 'alt' ]; 

		this.isModifierKey = function( keyCode ){
			return _modKeys.indexOf( keyCode ) !== -1; 

		}
		this.getModifierKeyPriority = function( modKey ){
			return _modKeys.indexOf( modKey );
		}
		/**
		 * Sets multikeybinding
		 * @param {[type]} action
		 * @key {array} an array of keycodes
		 */
		this.setMultiKeyBinding = function( action, keys ){
			if ( _.isString( keys ) || keys.length < 2 ){
				console.log( 'you only gave one keycode to setMultiKeyBinding()' ); 
				return false; 
			}
			// sort keys array, with modifier keys in order of priority at beginning, 
			// followed by all other keycodes in order of number
			keys = this.sortKeyCodes( keys );
			var binding = action;
			for(var i = keys.length -1; i >= 0; i--){
				var obj = {};
				obj[ keys[i] ] = binding; 
				binding = obj;
			}
			_multiKeyBindings = $.extend( true, _multiKeyBindings, binding );
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
			return that.sortKeyCodes( currentlyPressed );
		}
		this.isPressed = function( keyCode ){
		    if ( currentlyPressed.indexOf( keyCode ) !== -1 ){
		    	return true;
		    }			
		    return false;
		}
		this.sortKeyCodes = function( keyCodes ){
			return _.sortBy( keyCodes, function( keyCode ){
				if ( that.isModifierKey( keyCode ) ){
					return that.getModifierKeyPriority( keyCode ) - _modKeys.length; 		
				} else {
					return keyCode; 
				}
			}); 
		}
		this.triggerActions = function(){
			var pressedKeys = this.getPressed();
			var pressedKeys = this.sortKeyCodes([ 10, 13, 14, 40, 37, 'shift', 'command' ]); 
			var actionFound = false; 
			
			var actionsToTrigger = []; 

			var bindings = _multiKeyBindings; 
			// multi-key
			for ( var i = 0; i< pressedKeys.length; i++ ){
				var keyCode = pressedKeys[i]; 

				if ( _.has( _multiKeyBindings, keyCode ) ){
					var hasBinding = true;					
					var binding = _multiKeyBindings[keyCode];	
					var actionFound = false; 
					var actionKeys = [ keyCode ];	
					while( !actionFound && hasBinding ){
						var hasBinding = false; 
						for( var j = i; j < pressedKeys.length; j++ ){
							var extraKeyCode = pressedKeys[j]; 
							if ( _.has( binding, extraKeyCode )){
								actionKeys.push( extraKeyCode );
								binding = binding[extraKeyCode];
								hasBinding = true; 
								if ( _.isString( binding )){
									actionFound = true; 
									actionsToTrigger.push( binding );
									_.each( actionKeys, function( keyCode ){
										pressedKeys[ pressedKeys.indexOf( keyCode ) ] = ':'+binding; 
									});
								}
							}							
						}						
					}
				}				
			}
			// single key
			console.log( 'single: ', _bindings );
			for ( var i = 0; i< pressedKeys.length; i++ ){
				if ( _.has( _bindings, pressedKeys[i] ) ){
					actionsToTrigger.push( _bindings[pressedKeys[i]] );
				}
			}				
			console.log( actionsToTrigger );
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
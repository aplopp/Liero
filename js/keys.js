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
		var _bindings = {
			single: [] // for holding single-key actions
		};

		var _modKeys = [ 'command', 'control', 'shift', 'alt' ]; 
		this.getKeyCode = function(e){
			if ( e.metaKey ){ return 'command'; } 
			if ( e.ctrlKey ){ return 'control'; }
			if ( e.shiftKey ){ return 'shift'; }
			if ( e.altKey ){ return 'alt'; }
			return e.keyCode; 
		}
		this.isModifierKey = function( keyCode ){
			return _modKeys.indexOf( keyCode ) !== -1; 

		}
		this.getModifierKeyPriority = function( modKey ){
			return _modKeys.indexOf( modKey );
		}

		/**
		 * function to set multiple key bindings at once
		 * @param {object} keyBindings
		 */
		this.setBindings = function( updatedKeyBindings ){
			if ( !_.isObject( updatedKeyBindings ) ){
				console.log( 'keys.setBindings() needs an object');
				return false;				
				
			}
			_.each( updatedKeyBindings, function( keyCodes, action ){
				that.setBinding( action, keyCodes ); 
			}); 
			return _bindings;
		}		
		/**
		 * Sets a key combination (single or multiple) to trigger an action
		 * @param {string} action
		 * @key {int|string|array} a single keycode, or a array of keycodes
		 */
		this.setBinding = function( action, keyCodes ){
			// single key event
			if ( _.isString(keyCodes) || _.isNumber( keyCodes ) ){
				if ( _.isString( keyCodes ) || _.isNumber( keyCodes )){
					var keyCode = keyCodes; 
				} else if ( keyCodes.length === 1 ){
					var keyCode = keyCodes[0]; 
				}
				if ( _.isString( action ) ){
					if ( _.isNumber(keyCode) || that.isModifierKey( keyCode ) ){
						_bindings.single[ keyCode ] = action;
						return _bindings; 
					}
				}
				return false; 		
			
			// multikey event
			} else if (  _.isArray( keyCodes ) && keyCodes.length > 1 ){
		
				// sort keys array, with modifier keys in order of priority at beginning, 
				// followed by all other keycodes in order of number
				keyCodes = this.sortKeyCodes( keyCodes );
				var binding = action;
				for(var i = keyCodes.length -1; i >= 0; i--){
					var obj = {};
					obj[ keyCodes[i] ] = binding; 
					binding = obj;
				}
				_bindings = $.extend( true, _bindings, binding );
				return _bindings;
			}
			console.log( 'setBinding() requires a string, followed by either a string/number, or an array of string/numbers')
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
			var actionFound = false; 
			var actionsToTrigger = []; 

			var bindings = _bindings; 
			// multi-key
			for ( var i = 0; i< pressedKeys.length; i++ ){
				var keyCode = pressedKeys[i]; 

				if ( _.has( _bindings, keyCode ) ){
					var hasBinding = true;					
					var binding = bindings[keyCode];	
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
			for ( var i = 0; i< pressedKeys.length; i++ ){
				if ( _.has( _bindings.single, pressedKeys[i] ) ){
					actionsToTrigger.push( _bindings.single[pressedKeys[i]] );
				}
			}

			// loop through actions and trigger an event by that name	
			_.each( actionsToTrigger, function( action ){
				that.trigger( action ); 
			})
		}
		/**
		 * Kick it off by tying it to the document 'onkeydown' and 'onkeyup' functions
		 */
		var init = function(){
			document.onkeydown = function(e){
				e.preventDefault(); 
				that.pressKey( that.getKeyCode( e ) );
			}
			document.onkeyup = function(e){
				e.preventDefault(); 				
				that.unPressKey( e.keyCode );
			}
			if ( keyBindings ){
				that.setBindings( keyBindings );
			}
			return that;
		}
		init();
	}
	
	var pressedKeys = new Keys();
	return pressedKeys; 	
});
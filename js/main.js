require.config({
	shim: {
		createjs: {
			exports: 'createjs'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [ 'underscore' ],
			exports: 'Backbone'
		},
	}, 
	paths: {
		text: 'libs/text',
		backbone: 'libs/backbone-min',
		underscore: 'libs/underscore-min',
		jquery:  'http://code.jquery.com/jquery-1.10.2.min',
		createjs: 'http://code.createjs.com/createjs-2013.09.25.min'
	}
});

var app;
require(['app', 'settings' ], function( App, settings ){
	App.init( settings );
	app = App;
}); 
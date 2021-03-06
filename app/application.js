var settings = require('config/settings');

// Application bootstrapper.
App = new Backbone.Marionette.Application({
	// Settings object (Debug mode etc.)
	DEBUG: !!settings.DEBUG,
	settings: settings,

	// Application name (used for <title>)
	title: 'Marionette.Scaffold Application',

	// Root page
	rootRoute: '',

	// Grabs and initializes various components
	initializeComponents: function() {
		App.Components = require('components');
	},

	// Initializes the various modules of the application
	initializeModules: function() {
		App.Modules = require('modules');
	}
});

// Initialize components 
App.initializeComponents();

// Setup request handlers
App.reqres.setHandler('default:region', function() {
	return App.mainRegion;
});

// Setup command handlers
App.commands.setHandler('register:instance', App.register, App);
App.commands.setHandler('unregister:instance', App.unregister, App);

// Setup regions
App.addRegions({
	headerRegion: '#header-region',

	breadcrumbRegion: '#breadcrumb-region',
	
	mainRegion: App.Components.Regions.Page.extend({
		el: '#main-region'
	}),
	
	dialogRegion: App.Components.Regions.Dialog.extend({
		el: '#dialog-region'
	}),

	footerRegion: '#footer-region'
});

// Initialize modules
App.initializeModules();

// After initialization of the Application...
App.on('initialize:after', function() {
	App.startHistory();
});

// Debug all inter-signal calls via the Application.vent interface
if(App.DEBUG) {
	App.vent.on('all', function(evt, model) {
		console.log('DEBUG: Event Caught: ' + evt + ' with model ', model);
	});
}

module.exports = App;

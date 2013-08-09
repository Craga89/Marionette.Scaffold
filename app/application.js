var settings = require('config/settings');

// Application bootstrapper.
App = new Backbone.Marionette.Application({
	// Settings object (Debug mode etc.)
	DEBUG: !!settings.DEBUG,
	settings: settings,

	// Root page
	rootRoute: '',

	// Controller objects
	Controllers: {
		Base: require('controllers/base')
	},

	// Grabs and initializes various components
	initializeComponents: function() {
		App.api = require('api');

		App.components = {
			utilities: require('entities/base/utilities'),
			loading: require('components/loading/loading_controller')
		};
	},

	// Initializes the various 'Apps' of the application, representing
	// different pages and regions on the page
	initializeModules: function() {
		App.modules = {
			header: require('apps/header/header_app'),
			home: require('apps/home/home_app'),
			footer: require('apps/footer/footer_app')
		};
	}
});

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
	footerRegion: '#footer-region',
	mainRegion: require('views/regions/page').extend({ el: '#main-region' }),
	dialogRegion: require('views/regions/dialog').extend({ el: '#dialog-region' })
});

// Setup dummy user
App.user = new (require('entities/users').Model)({
	username: 'Craig',
	firstName: 'Craig',
	lastName: 'Thompson',
	email: 'craig@craigsworks.com'
});

// Initialize components
App.initializeComponents();

// Initialize modules
App.initializeModules();

// After initialization of the Application...
App.on('initialize:after', function() {
	App.startHistory();
});

// Debug all inter-signal calls via the Application.vent interface
App.vent.on('all', function(evt, model) {
	console.log('DEBUG: Event Caught: ' + evt + ' with model ', model);
});

module.exports = App;
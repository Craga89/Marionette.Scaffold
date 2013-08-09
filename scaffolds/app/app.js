var api = require('api'),
	IndexController = require('./index/index_controller');

var ScaffoldRouter = Marionette.AppRouter.extend({
	appRoutes: {
		// App-specific routes for this sub-app 
	}
});

var API = {
	// Generic application
	index: function() {
		
	}
};

// Initialize router on app start
App.addInitializer(function() {
	new ScaffoldRouter({
		controller: API
	});
});

module.exports = API;

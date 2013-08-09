var api = require('api'),
	IndexController = require('./index/index_controller');

var WelcomeRouter = Marionette.AppRouter.extend({
	appRoutes: {
		'': 'index'
	}
});

var API = {
	// Generic application
	index: function() {
		return new IndexController();
	}
};

// Initialize router on app start
App.addInitializer(function() {
	new WelcomeRouter({
		controller: API
	});
});

module.exports = API;

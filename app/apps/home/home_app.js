var api = require('api'),
	DashboardController = require('./dashboard/dashboard_controller');

var HomeRouter = Marionette.AppRouter.Authenticated.extend({
	appRoutes: {
		'': 'dashboard'
	}
});

var API = {
	dashboard: function() {
		return new DashboardController();
	}
};

// Initialize router on app start
App.addInitializer(function() {
	new HomeRouter({
		controller: API
	});
});

module.exports = API;
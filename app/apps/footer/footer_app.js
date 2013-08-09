var ListController = require('./list/list_controller'),
	TermsController = require('./terms/terms_controller');

var FooterRouter = Marionette.AppRouter.Authenticated.extend({
	appRoutes: {
		'terms': 'terms'
	}
});

var API = {
	list: function() {
		return new ListController({
			region: App.footerRegion
		});
	},

	terms: function() {
		return new TermsController();
	}
};

// Show footer immediately
API.list();

// Initialize router on app start
App.addInitializer(function() {
	new FooterRouter({
		controller: API
	});
});

module.exports = API;
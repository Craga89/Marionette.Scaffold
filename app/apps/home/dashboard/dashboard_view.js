var DashboardView = Marionette.ItemView.extend({
	template: require('./templates/dashboard'),

	id: '#dashboard',
	attributes: {
		action: App.request('api:url', 'dashboard'),
		method: 'post'
	},

	title: 'Dashboard'
});

module.exports = DashboardView;
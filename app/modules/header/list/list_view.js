var NavigationView = require('./navigation_view'),
	UserNavigationView = require('./user_navigation_view'),
	BreadcrumbsView = require('./breadcrumbs_view');

var ListLayout = Backbone.Marionette.Layout.extend({
	template: require('./templates/header'),
	id: 'header',
	tagName: 'header',
	className: 'navbar navbar-fixed-top',

	regions: {
		navRegion: '#nav',
		UserNavRegion: '#user-nav'
	},

	onRender: function() {
		// Show regions
		this.navRegion.show( this.getNavigationView() );
	},

	getNavigationView: function() {
		return new NavigationView();
	}
});

module.exports = ListLayout;
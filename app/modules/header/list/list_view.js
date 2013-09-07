var NavigationView = require('./navigation_view');

var ListLayout = Backbone.Marionette.Layout.extend({
	template: require('./templates/layout'),
	id: 'header',
	tagName: 'nav',
	className: 'navbar navbar-default navbar-fixed-top',

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

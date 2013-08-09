var BreadcrumbsView = Marionette.ItemView.extend({
	template: require('./templates/breadcrumbs'),
	tagName: 'ul',
	className: 'breadcrumb',

	collection: new Backbone.Collection(),
	collectionEvents: { 'reset': 'render' },

	initialize: function() {
		// Listen for App commands
		App.commands.setHandler('update:breadcrumbs', function(breadcrumbs) {
			this.collection.reset(breadcrumbs);
		}, this);
	}
});

module.exports = BreadcrumbsView;
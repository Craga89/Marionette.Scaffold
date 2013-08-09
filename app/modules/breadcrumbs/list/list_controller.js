var ListView = require('./list_view');

var ListController = App.Components.Controllers.Base.extend({

	initialize: function() {
		// Create breadcrumbs collection
		this.breadcrumbs = new Backbone.Collection();

		// Create and show the view
		var view = this.getListView(this.breadcrumbs);
		this.show( view );

		// Handle breadcrumb updates
		console.log('test');
		App.commands.setHandler('update:breadcrumbs', function(breadcrumbs) {
			console.log(arguments);
			this.breadcrumbs.reset(breadcrumbs);
		}, this);
	},

	// View getters
	getListView: function(breadcrumbs) {
		return new ListView({
			collection: breadcrumbs
		});
	}
});

module.exports = ListController;

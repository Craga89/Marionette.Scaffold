module.exports = Backbone.Marionette.Region.extend({
	open: function(view) {
		if(view.id !== "#login") {
			// Update page breadcrumbs
			this.updateBreadcrumbs(view);
		}
			
		// super()
		this._super('open', arguments);
	},

	updateBreadcrumbs: function(view) {
		var breadcrumbs = [{
			url: '#' + App.rootRoute,
			name: 'Home'
		}];

		// Add view breadcrumbs if defined
		if(view.breadcrumbs) {
			breadcrumbs.push(view.breadcrumbs);
		}

		// IF the curent page isn't the root application route, add it
		if(location.hash !== App.rootRoute) {
			breadcrumbs.push({
				url: location.hash,
				name: view.title || this.id
			});
		}

		// Execute a breadcrumbs update
		App.execute("update:breadcrumbs", _.flatten(breadcrumbs));
	},

	onClose: function() {
		// Close the dialogs for the current page
		App.dialogRegion.close();
	}
});
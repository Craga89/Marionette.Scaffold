var ListLayout = require('./list_view');

var ListController = App.Components.Controllers.Base.extend({
	type: 'Header',

	initialize: function() {
		var view = this.getLayoutView();
		this.show( view );
	},

	// View getters
	getLayoutView: function() {
		return new ListLayout();
	}
});

module.exports = ListController;
var ListLayout = require('./list_view');

var ListController = App.Controllers.Base.extend({
	type: 'Footer',

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
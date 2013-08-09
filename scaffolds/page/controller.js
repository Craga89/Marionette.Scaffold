var ScaffoldView = require('./dashboard_view');

var ScaffoldController = App.Controllers.Base.extend({

	initialize: function() {
		var view = this.getScaffoldView();
		this.show( view );
	},

	// View getters
	getScaffoldView: function() {
		return new ScaffoldView();
	}
});

module.exports = ScaffoldController;

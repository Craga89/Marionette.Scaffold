var DashboardView = require('./dashboard_view');

var DashboardController = App.Controllers.Base.extend({

	initialize: function() {
		var view = this.getDashboardView();
		this.show( view );
	},

	// View getters
	getDashboardView: function() {
		return new DashboardView();
	}
});

module.exports = DashboardController;
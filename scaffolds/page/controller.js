var ScaffoldView = require('./scaffold_view');

var ScaffoldController = App.Components.Controllers.Base.extend({

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

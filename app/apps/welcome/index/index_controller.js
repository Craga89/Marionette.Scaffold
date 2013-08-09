var IndexView = require('./index_view');

var IndexController = App.Controllers.Base.extend({

	initialize: function() {
		var view = this.getIndexView();
		this.show( view );
	},

	// View getters
	getIndexView: function() {
		return new IndexView();
	}
});

module.exports = IndexController;

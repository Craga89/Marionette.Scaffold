var TermsLayout = require('./terms_view');

var TermsController = App.Controllers.Base.extend({

	initialize: function() {
		var view = this.getTermsView();
		this.show( view );
	},

	// View getters
	getTermsView: function() {
		return new TermsLayout();
	}
});

module.exports = TermsController;
var PanelLayout = require('./panel_view');

var PanelController = App.Components.Controllers.Base.extend({
	type: 'Footer',

	initialize: function() {
		var view = this.getLayoutView();
		this.show( view );
	},

	// View getters
	getLayoutView: function() {
		return new PanelLayout();
	}
});

module.exports = PanelController;
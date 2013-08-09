var PanelController = require('./panel/panel_controller');

var API = {
	panel: function() {
		return new PanelController({
			region: App.footerRegion
		});
	}
};

// Show footer immediately
API.panel();

module.exports = API;
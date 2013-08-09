var ListController = require('./list/list_controller');

var API = {
	list: function() {
		return new ListController({
			region: App.breadcrumbRegion
		});
	}
};

API.list();

module.exports = API;

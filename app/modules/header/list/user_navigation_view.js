var api = require('api');

var UserNavigationView = Marionette.ItemView.extend({
	template: require('./templates/user_navigation'),

	tagName: 'ul',
	className: 'user-nav nav nav-pills pull-right',

	modelEvents: {
		'sync reset change': 'render'
	}
});

module.exports = UserNavigationView;
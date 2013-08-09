var IndexView = Marionette.ItemView.extend({
	template: require('./templates/index'),

	id: '#index',
	attributes: {
		action: '/path/to/api',
		method: 'post'
	},

	title: 'Index'
});

module.exports = IndexView;

var ScaffoldView = Marionette.ItemView.extend({
	template: require('./templates/scaffold'),

	id: '#scaffold',
	attributes: {
		action: '/path/to/api',
		method: 'post'
	},

	title: 'Scaffold'
});

module.exports = ScaffoldView;

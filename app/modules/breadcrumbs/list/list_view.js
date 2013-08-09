var ListView = Marionette.ItemView.extend({
	template: require('./templates/list'),

	tagName: 'ul',
	className: 'breadcrumb',

	collectionEvents: {
		'reset': 'render'
	}
});

module.exports = ListView;
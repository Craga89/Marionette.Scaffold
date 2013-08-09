var TermsView = Marionette.Layout.extend({
	template: require('./templates/terms'),

	id: 'terms',
	tagName: 'div',
	className: '',

	title: 'Terms and Conditions'
});

module.exports = TermsView;
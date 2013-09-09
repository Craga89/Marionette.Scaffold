var Footer = Backbone.Marionette.Layout.extend({
	template: require('./templates/panel'),

	id: 'footer',
	tagName: 'nav',
	className: 'navbar navbar-default'
});

module.exports = Footer;

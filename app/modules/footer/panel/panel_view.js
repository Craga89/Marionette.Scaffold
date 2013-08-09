var Footer = Backbone.Marionette.Layout.extend({
	template: require('./templates/panel'),

	id: 'footer',
	tagName: 'footer',
	className: 'navbar navbar-static-top'
});

module.exports = Footer;

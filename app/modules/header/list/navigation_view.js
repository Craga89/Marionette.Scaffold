var NavigationView = Marionette.ItemView.extend({
    template: require('./templates/navigation'),
    tagName: 'ul',
    className: 'nav navbar-nav'
});

module.exports = NavigationView;
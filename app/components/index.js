module.exports = {
	Controllers: {
		Base: require('./controllers/base'),
		Loading: require('./loading/loading_controller')
	},

	Entities: {
		Utilities: require('./entities/utilities')
	},

	Views: {
		Form: require('./views/form'),
		SlickGrid: require('./slickgrid/slickgrid_view')
	},

	Regions: {
		Page: require('./regions/page'),
		Dialog: require('./regions/dialog')
	},

	Routers: {
		Authenticated: require('./routers/authenticated')
	}
};

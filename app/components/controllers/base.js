// Base Controller that all others should derive from
module.exports = Marionette.Controller.extend({
	constructor: function(options) {
		if(options == null) { options = {}; }

		this.region = options.region || App.request("default:region");

		// Assign a unique instance ID for tracking
		this._instance_id = _.uniqueId( this.type || 'Controller' );
		App.execute("register:instance", this, this._instance_id);

		// super()
		Marionette.Controller.prototype.constructor.apply(this, arguments);
	},

	close: function() {
		// Unregister instance
		App.execute("unregister:instance", this, this._instance_id);

		// super()
		return Marionette.Controller.prototype.close.apply(this, arguments);
	},

	show: function(view, options) {
		if(options == null) { options = {}; }
		_.defaults(options, {
			loading: false,
			region: this.region
		});

		this._setMainView(view);
		return this._manageView(view, options);
	},

	_setMainView: function(view) {
		// If a main view is already set, return#
		if(this._mainView) { return; }
		this._mainView = view;

		// Close the controller when the view closes
		return this.listenTo(view, "close", this.close);
	},

	_manageView: function(view, options) {
		if(options.loading) {
			// When the real view has loaded
			view.once('loading:done', function() {
				this.show( view );
			}, this);

			// Generate a loading controller that will handle loading sequence for us
			App.execute('show:loading', view, options);

			// PAss the real view to updateBreadcrumbs
			this.region.updateBreadcrumbs && this.region.updateBreadcrumbs(view);
		}
		else {
			return options.region.show(view);
		}
	}
});
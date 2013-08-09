var BaseController = require('../controllers/base'),
	LoadingViews = require('./loading_view');

var LoadingController = BaseController.extend({
	type: 'Loading',

	initialize: function(options) {
		var config = options.config;

		// Grab the real view
		this.realView = options.view;

		// Handle loading: true
		config = _.isBoolean(config) ? {} : config;
		_.defaults(config, {
			loadingType: 'spinnerInline',
			entities: this.getEntities( this.realView ),
			debug: false
		});

		// Set the main view manually so controller closes properly
		this._setMainView(this.realView);

		// If an invalid loading type was specified, just show the real view.
		// Also show it immediately if a loadingType was specified that requires a
		// previous view to be currently shown, and one isn't.
		var type = this[ config.loadingType ];
		if(!type || (type.requirePrevious && !this.region.currentView) ) { 
			return this.show( this.realView );
		}

		// Extend config with any properties returned from loading type.
		// Fetch the provided entities and show the real view after they're loaded.
		this.fetchAndShow( type, _.extend(config, type.setup.call(this) || {}) );
	},

	_entitiesFetched: function(loadingType, config) {
		// If the view has changed since the first one was set, or the controllers closed...  return
		if(!this.realView || (this.preView && this.region.currentView !== this.preView)) {
			return;
		}

		// Perform post-loading operation
		_.isFunction(loadingType.loaded) && loadingType.loaded.call(this, config);

		// Show the realView
		if(!config.debug) {
			this.show( this.realView );
		}
	},

	fetchAndShow: function(loadingType, config) {
		var _this = this;
		App.request('when:fetched', config.entities).always(
			_.bind(this._entitiesFetched, this, loadingType, config)
		);
	},

	show: function(view, close) {
		// Store the view used
		if(!this.preView) { this.preView = view; }

		// If it's the real view, signal out
		if(view === this.realView) {
			this.realView.trigger('loading:done');
			if(close !== false) { this.close(); }
			return;
		}

		// super()
		this._super('show', [view]);
	},

	getEntities: function(view) {
		return _.chain(view).pick('model', 'collection').toArray().compact().value();
	},

	getSpinnerView: function(overlay) {
		return new LoadingViews.Spinner({
			overlay: overlay
		});
	},

	onClose: function() {
		delete this.loadingView;
		delete this.realView;
		delete this.preView;
	},


	// ===============================
	// Loading view types
	// ===============================
	opacity: {
		requirePrevious: true,
		setup: function() {
			this.region.currentView.fadeTo(0.5, 200);
		},
		loaded: function() {
			this.region.currentView.fadeTo(1, 200);
		}
	},

	spinnerInline: {
		setup: function() {
			// Show the real view first
			this.show( this.realView, false );

			// Generate an overlaid loading view
			this.loadingView = this.getSpinnerView(true);

			// Append the spinner element to the real view and set position css (store it first)
			var position = this.realView.el.style.position || '';
			this.realView.$el.append( this.loadingView.el )
				.css('position', 'relative');
			
			// Render the spinner view
			this.loadingView.render();
			this.loadingView.triggerMethod('show');

			// Don't re-show the view in fetchAndShow (se debug flag)
			return { debug: true, position: position };
		},
		loaded: function(config) {
			// If the view changed... don't do anything
			if(this.region.currentView !== this.realView) { return; }

			// Remove the spinner element and cLose the loading view
			this.loadingView.$el.remove();
			this.loadingView.close();

			// Reset the position css style to the stored one from setup()
			this.realView.$el.css('position', config.position);

			// Close the controller
			this.close();
		}
	},

	spinner: {
		setup: function() {
			// Show the spinner view in place of the real view
			this.loadingView = this.getSpinnerView();
			this.show( this.loadingView );
		}
	}
});

App.commands.setHandler('show:loading', function(view, options) {
	return new LoadingController({
		view: view,
		region: options.region,
		config: options.loading
	});
});

module.exports = LoadingController;
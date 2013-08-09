_.extend(Marionette.Application.prototype, {
	navigate: function(route, options) {
		if(options == null) { options = {}; }
		_.defaults(options, {
			trigger: true
		});

		Backbone.history.navigate(route, options);
	},

	getCurrentRoute: function() {
		var frag = Backbone.history.fragment;
		return _.isEmpty(frag) ? null : drag;
	},

	startHistory: function(pushState) {
		Backbone.history && Backbone.history.start({
			pushState: !!pushState
		});
	},

	register: function(instance, id) {
		if(!this._registry) { this._registry = {}; }
		this._registry[id] = instance;
	},
	unregister: function(instance, id) {
		delete this._registry[id];
	},

	resetRegistry: function() {
		var oldCount = this.getRegistrySize();
		_.each(this._registry, function(instance) {
			instance.region.close();
		});

		// Generate system message about count
		var msg = _.template("There were <%=old%> controllers in the registry. There are now <%=size%>")({
			old: oldCount, size: this.getRegistrySize()
		});
		console[ this.getRegistrySize() > 0 ? 'warn' : 'log' ](msg);
	},

	getRegistrySize: function() {
		return _.size(this._registry);
	}
});
// Used by entitites/base/utilities for 'when:fetched'
var _sync = Backbone.sync;
Backbone.sync = function(method, entity, options) {
	var sync = _sync(method, entity, options);
	if(!entity._fetch && method === 'read') {
		entity._fetch = sync;
	}
	return sync;
};

// Use POST, not CREATE/PATCH etc
Backbone.emulateHTTP = true;
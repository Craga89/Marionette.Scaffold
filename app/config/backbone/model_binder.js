// var bind = Backbone.ModelBinder.prototype.bind;
// Backbone.ModelBinder.prototype.bind = function(model, rootEl, attributeBindings, options) {

// }

var _setElValue = Backbone.ModelBinder.prototype._setElValue;
Backbone.ModelBinder.prototype._setElValue = function(el) {
	// super()
	_setElValue.apply(this, arguments);

	// Trigger 'change' event for Select2 / BFHPhone elements
	if(el.is('.select2-offscreen') || el.data('bfhphone') ) {
		el.trigger('change');
	}
};

var _getElValue = Backbone.ModelBinder.prototype._getElValue;
Backbone.ModelBinder.prototype._getElValue = function(binding, el) {
	// Support BFHPhone elements
	if(el.is('.bfh-phone')) {
		return el.data('number') || el.val();
	}
	return _getElValue.apply(this, arguments);
};
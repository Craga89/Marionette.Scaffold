// Allow blank templates
var _render = Marionette.Renderer.render;
Marionette.Renderer.render = function(template) {
	if(template === false) { return; }
	return _render.apply(this, arguments);
};
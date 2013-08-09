// Custom handler that lets use fetch several collections at once, and
// wait for the outcome before executing a callback.
App.reqres.setHandler("when:fetched", function(entities) {
	var xhrs = _.chain([entities]).flatten().pluck('_fetch').value();

	return $.when.apply($.when, xhrs);
});
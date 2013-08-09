// Base User model
var User = Backbone.Model.extend({
	idAttribute: 'username'
});

// Collection that manages all types of users
var Users = Backbone.Collection.extend({

});

module.exports = {
	Model: User,
	Collection: Users
};
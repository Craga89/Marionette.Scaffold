// Custom Authentication route pre-preprocessor. This class is similar
// to the regular AppRouter class, but ensures that all URL requests
// are checked to ensure the user is logged in before being handled.
// If the user is not logged in, they will be redirected to the login page.
module.exports = Marionette.AppRouter.extend({
	before: {
		'*any': function(fragment, args) {
			var isLoginPage = /^login/.test(fragment);

			// Redirect non-logged in users to the login page
			if(!isLoginPage && App.user.isNew()) {
				console.log('Not logged in... direct to login page');
				this.navigate('/login', true);
				return false;
			}

			// Redirect logged in users to the homepage when accessing login
			else if(!App.DEBUG) {
				if(isLoginPage && !App.user.isNew()  ) {
					console.log('already logged in... direct to login page');
					this.navigate('', true);
					return false;
				}
			}
		}
	}
});
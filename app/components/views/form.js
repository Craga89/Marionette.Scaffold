var StatesCollection = new (require('entities/states').Collection)();

var validationDefaults = {
	rules: {
		Email: { email: true },
		FirstName: { nonNumeric: true },
		LastName: { nonNumeric: true },
		City: { nonNumeric: true },
		State: { nonNumeric: true },
		HomePhone: { phoneUS: true },
		PostalCode: { zipcodeUS: true }
	}
};

var properties = {
	tagName: 'form',
	attributes: {
		action: '',
		method: 'post',
		autocomplete: 'on',
		validate: 'on'
	},

	// Statse model
	_states: StatesCollection,

	// Constructor method
	initialize: function(options) {
		_.bindAll(this, 'submit', 'showMessage', 'hideMessage');

		// Instantiate binders
		if(this.model) {
			this.modelBinder = new Backbone.ModelBinder();
		}

		// Fetch the states if not already
		if(this._states.isEmpty()) {
			this._states.fetch({ reset: true, cache: true });
		}

		// Initialise form and p
		this.on('dom:refresh', this._initForm, this);

		// Re-populate state dropdowns if state collection changes
		this.listenTo(this._states, 'sync reset', this._populateStates, this);

		// Merge in validation defaults
		this.validation = _.deepExtend({}, validationDefaults, this.validation);

		// Setup spinner
		this.spinner = new Spinner();

		// super()
		this._super('initialize', arguments);
	},

	// Sets up validation on the passed form(s), ensuring appropriate classes
	// and error placement for use with the Bootstrap stylings
	_initForm: function(form) {
		var _this = this;

		// Store the resulting validator as a propery of the View
		this.validator = this.$el.validate( _.extend(this.validation, {
			// Ignore elements with the HTML5 novalidate attribute
			ignore: '[novalidate]',

			// Bootstrap-style classes
			validClass: 'success',
			errorClass: 'error',

			// See `_highlightInput()` method (Bootstrap compatible highlighting)
			highlight: function(a,b,c) { _this._highlightInput(true, a, b, c); },
			unhighlight: function(a,b,c) { _this._highlightInput(false, a, b, c); },

			// Add all error messages to the `.help-inline` element (Bootstrap compatible)
			errorPlacement: function(error, element) {
				$(element).closest('.control-group').find('.help-inline').html(error.text());
			},

			// Handle all form submissions via the `submit()` handler.
			submitHandler: this.submit
		}) );

		// Bind model events
		this.modelBinder && this.modelBinder.bind(this.model, this.el, _.result(this, 'modelBindings'));

		// Initialise inputs
		this._initializeInputs();
	},

	// Reverse of populateForm. Populates model with form data
	populateModel: function() {
		this.model.set( this.$el.jsonify() );
	},

	// Properly highlights/unhighlights inputs using appropriate Bootstrap
	// styles and elements. 
	_highlightInput: function(state, element, validClass, errorClass) {
		var group = $(element).closest('.control-group');

		group.toggleClass(validClass, state)
			.toggleClass(errorClass, !state);

		if(!state) {
			group.find('.help-inline').html('');
		}
	},

	// Populates all `State` dropdowns using our this._states data source.
	// JSON data is defined in `entities/states.js`.
	_populateStates: function(initialize) {
		// Is the states collection is empty, return
		if(this._states.isEmpty()) { return; }

		// Find all state select elements
		var elems = this.$('select.states').filter(':empty');
		if(!elems.length) { return; }

		// Generate options HTML for each State
		var options = '<option></option>' + this._states.map(function(state) {
			return '<option value="'+state.get('name')+'">'+state.get('name')+'</option>';
		}).join('');

		// Set the <select/> elements HTML
		elems.append( options );

		// Initialize styling if enabled
		if(initialize !== false) {
			this._initializeSelects( elems.trigger('change').filter(':visible') );
		}
	},

	// Initialies the `select` plugin on all passed <select/> elements,
	// ensuring HTML5 `placeholder` value is used where appropriate.
	_initializeSelects: function(elements) {
		elements.each(function() {
			var elem = $(this).restore();

			elem.select2({
				allowClear: true,
				placeholder: elem.attr('placeholder')
			});

			elem.select2("enable", !elem.is('[disabled]'));
			elem.select2("readonly", elem.is('[readonly]'));
		});
	},

	// Initialises custom form helpers and plugins on all valid
	// elements, such as the `select2` plugin on all <select/> elements
	// and the Bootstrap Form Helpers Telephone formatter on telephone inputs.
	_initializeInputs: function() {
		var inputs = this.$(':input');

		// Restore form values if possible
		this.$el.restore();

		// Create bootstrap button instances on all .btn elements
		this.$('.btn').button();

		// Populate states if not already
		this._populateStates(false);

		// Setup select2 <select> boxes
		this._initializeSelects(
			inputs.filter('select:not(:empty)')
		);

		// Setup phone validators
		inputs.filter('.bfh-phone').each(function() {
			var elem = $(this); elem.bfhphone({
				format: elem.data('format'),
				number: elem.val()
			});
		});
	},

	submit: function() {
		console.log('SUBMIT trigger. Data: ', this.$el.jsonify);
	},

	showMessage: function(type, message) {
		var elem = this.$('.form-message')
			.addClass( this._lastAlertClass = 'alert-'+type )
			.children('span').html(message).end();

		if(elem.is(':visible')) {
			elem.fadeTo(125, 0).fadeTo(125, 1);
		}
		else {
			elem.fadeIn();
		}

		$('document, body').animate({
			scrollTop: this.$el.offset().top
		}, 200, 'swing');
	},

	hideMessage: function() {
		this.$('.form-message').removeClass(this._lastAlertClass).fadeOut();
	},

	close: function() {
		this.modelBinder && this.modelBinder.unbind();
		this._super('close', arguments);
	}
};

// Define it as a Layout and ItemView type
module.exports = {
	View: Marionette.ItemView.extend(properties),
	Layout: Marionette.Layout.extend(properties)
};
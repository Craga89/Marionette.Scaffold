var dialogTemplate = require('templates/dialogs/default');

// http://twitter.github.com/bootstrap/javascript.html#modals
// http://lostechies.com/derickbailey/2012/04/17/managing-a-modal-dialog-with-backbone-and-marionette/
module.exports = Backbone.Marionette.Region.extend({
	_ns: '.modalregion',

	open: function(view) {
		// If a loading view was passed initially...
		if(view._type === 'loading') {
			this.$el.empty();
			view.$el.appendTo(document.body);
			return;
		}

		// Merge options into defaults
		var options = this.getDefaultOptions( view, _.result(view, 'dialog') );

		// Render dialog template
		this.dialog = (this.$dialog = $( Marionette.Renderer.render(options.template, options) ))[0];
		
		// Insert dialog HTML, and insert content into it's dialog-body element
		this.$dialog.find('.modal-body').append(view.el);
		this.$el.empty().append( this.dialog );

		// Setup buttons
		this.$dialog.find('.modal-footer .btn').button();

		// Setup bindings
		this.setupBindings(view, options);
	},

	onShow: function(view) {
		if(view._type !== 'loading') {
			this.dialogShow();
		}
	},

	setupBindings: function(view, options) {
		var _this = this;

		// Close when the dialog closes
		this.$dialog.on('hidden', _.bind(this.close, this));

		// Setup button bindings
		this.$dialog.find('.modal-footer[id]:first .btn').each(function(i) {
			var opts = options.buttons[i];

			// Determine the correct callback to use
			var callback = _.isFunction(opts.click) ? opts.click :
				_.isString(opts.click) ? view[opts.click] : null;
			
			// Use the provided button callback, or default if not present
			$(this).on('click', _.bind(callback || function(event) {
				return this.triggerMethod("dialog:button:clicked", event);
			}, view));
		});

		// Additional trigger responders for actions within view
		this.listenTo(view, 'dialog:close', this.close, this);
		this.listenTo(view, 'dialog:resize', this.dialogResize, this);
		this.listenTo(view, 'dialog:title', this.dialogSetTitle, this);
		this.listenTo(view, 'dialog:buttons:disable', _.partial(this.dialogButtonsDisabled, true), this);
		this.listenTo(view, 'dialog:buttons:enable', _.partial(this.dialogButtonsDisabled, false), this);
		this.listenTo(view, 'dialog:buttons:state', this.dialogButtonsState, this);
	},

	getDefaultOptions: function(view, options) {
		var _ref, self = this;
		options = _.extend({}, options);

		return _.defaults(options, {
			id: _.uniqueId('dialog-'),
			template: dialogTemplate,
			title: view.title,
			dialogClass: 'dialog',
			buttons: [{
				text: (_ref = options.button) != null ? _ref : "Ok",
				click: function() {
					return self.currentView.triggerMethod("dialog:button:clicked");
				}
			}]
		});
	},

	dialogShow: function() {
		if(!this._dialogShown) {
			this._dialogShown = true;
			this.$dialog.modal('show').attr('aria-hidden', false);
		}
	},

	dialogSetTitle: function(title) {
		this.$dialog.find('.modal-header [id$="-header"]').text(title);
	},

	dialogButtonsState: function(state) {
		this.$dialog.find('.modal-footer .btn').button(state);
	},

	dialogButtonsDisabled: function(state) {
		this.$dialog.find('.modal-footer .btn, [data-dismiss="modal"]')[state ? 'attr' : 'removeAttr']
			('disabled', 'disabled');
	},

	dialogClose: function(state) {
		if(this._dialogShown) {
			this._dialogShown = false;
			this.$dialog.modal('hide').attr('aria-hidden', true); 
		}
	},

	close: function() {
		var view = this.currentView;
		if (!view || view.isClosed){ return; }

		// super() and stop listening to events
		this._super('close', arguments);
		this.stopListening();

		// If a dialog is rendered
		if(this.dialog) {
			this.$dialog.on('hidden', function() {
				$(this).remove();
			});
			
			// Get rid of the additional dialog elements
			this.dialogClose();
			delete this.$dialog;
			delete this.dialog;
		}
	}
});
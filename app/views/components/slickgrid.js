var SlickGridView = Backbone.Marionette.ItemView.extend({
	template: false,

	className: 'grid',

	collectionEvents: {
		'sync reset': 'setItems',
		'change': 'updateItem',
		'add': 'addItem',
		'delete': 'deleteItem',
		'sort': 'sortItems'
	},

	defaults: {
		explicitInitialization: true,
		enableCellNavigation: true,
		enableColumnReorder: false,
		fullWidthRows: true,
		forceFitColumns: true,
		multiColumnSort: true,
		rowHeight: 32,
		headerRowHeight: 40,
		autoHeight: Modernizr.touch
	},

	initialize: function(options) {
		_.bindAll(this);

		// Ensure a valid collection is passed
		if(!options.collection) {
			this.close();
			throw new Error('SlickGrid require a valid Backbone.Collection to be passed!');
		}

		// Set class properties
		this.options = options;
		this.namespace = options.namespace;

		// Validate formatter strings
		_.each(this.options.columns, function(def) {
			if(_.isString(def.formatter)) {
				def.formatter = formatters[def.formatter] || null;
			}
		});

		// Setup event handlers using namespace
		this.listenTo(App.vent, 'search:'+this.namespace+':grid', this.search);
		this.listenTo(App.vent, 'refresh:'+this.namespace+':grid', this.refresh);
	},

	onDomRefresh: function() {
		// Work around bug with SlickGrid width detection
		this.$el.width( this.$el.parent().width() );

		// Initialise the DataView and SlickGrid
		this.instantiateDataView();
		this.instantiateGrid();
		this.grid.init();

		// Process the current data
		this.setItems();
	},

	onClose: function() {
		this.grid && this.grid.destroy();
	},

	_toJSON: function(entity) {
		var json;

		// Models
		if(entity.cid) {
			json = entity.toJSON();
			json.id = entity.id;
		}

		// Collections
		else {
			json = entity.map(function(model) { 
				return this._toJSON(model);
			}, this);
		}

		return json;
	},

	instantiateGrid: function() {
		var _this = this;

		// Create the SlickGrid plugin interface
		window.g = this.grid = new Slick.Grid(
			this.$el, this.dataView, this.options.columns,
			_.extend(this.defaults, this.options)
		);

		// Upon sorting the Grid, refresh the dataView
		this.grid.onSort.subscribe(function (e, args) {
			var cols = args.sortCols;

			_this.dataView.getItems().sort( function(dataRow1, dataRow2) {
				for (var i = 0, l = cols.length; i < l; i++) {
					var field = cols[i].sortCol.field;
					var sign = cols[i].sortAsc ? 1 : -1;
					var value1 = dataRow1[field], value2 = dataRow2[field];
					var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
					if (result !== 0) {
						return result;
					}
				}
				return 0;
			});

			_this.grid.invalidate();
			_this.grid.render();
			_this.dataView.refresh();
		});
	},

	// Setup basic DataView object
	instantiateDataView: function() {
		var _this = this;

		this.dataView = new Slick.Data.DataView({});

		this.dataView.setFilter( this.filter );

		this.dataView.onRowCountChanged.subscribe(function (e, args) {
			_this.grid.updateRowCount();
			_this.grid.render();
		});

		this.dataView.onRowsChanged.subscribe(function (e, args) {
			_this.grid.invalidateRows(args.rows);
			_this.grid.render();
		});
	},

	// Backbone.Collection/Model => SlickGrid.dataView bindings
	updateItem: function(model) {
		App.DEBUG && console.log('[COLLECTION EVENT] Updating SlickGrid item...', model);
		this.dataView.updateItem(model.id, this._toJSON(model));
	},
	addItem: function(model) {
		App.DEBUG && console.log('[COLLECTION EVENT] Adding SlickGrid item...', model);
		this.dataView.addItem( this._toJSON(model) );
	},
	deleteItem: function(model) {
		App.DEBUG && console.log('[COLLECTION EVENT] Deleting SlickGrid item...', model);
		this.dataView.deleteItem(model.id);
	},
	sortItems: function() {
		App.DEBUG && console.log('[COLLECTION EVENT] Re-sorting SlickGrid items');
		this.setItems();
		this.dataView.reSort();
	},
	setItems: function() {
		App.DEBUG && console.log('[COLLECTION EVENT] Setting SlickGrid items...', this.collection);
		this.dataView.beginUpdate();
		this.dataView.setItems( this._toJSON(this.collection) );
		this.dataView.endUpdate();
	},
	refresh: function() {
		_this.grid.render();
	},

	// Search/filter functionality
	searchString: '',
	search: function(term) {
		this.searchString = '' + $.trim( term.toLowerCase() );
		this.dataView.refresh();
	},
	filter: function(item) {
		var columns = this.grid.getColumns(), found = true;

		if(_.isString(this.searchString)) {
			found = false;
			for(var i in columns) {
				var field = item[ columns[i].field ];
				if(_.isString(field) && field.toLowerCase().indexOf(this.searchString) > -1) {
					found = true;
					break;
				}
			}
		}

		return found;
	}
});

// Field formatters. `_.bind`'d to ensure `this` refers to the formatters object
var formatters = {
	// Renders a given field as a regular link, passed as the first argument
	// This method is a helper called by other formatters
	link: function(url, classes, row, cell, value) {
		return '<a href="'+url+'" class="'+classes+'" title="'+value+'">'+(value != null ? value : '')+'</a>' || '';
	},
	
	// Renders a given field as a regular link, passed as the first argument
	// This method is a helper called by other formatters
	action: function(url, id, classes, row, cell, value, tooltip) {
		return '<a href="'+url+'" data-id="'+id+'" class="'+classes+'" title="'+tooltip+'">'+(value != null ? value : '')+'</a>' || '';
	},
	// Render fields as a link to a specific page in the app
	view: function(row, cell, value, field, data) {
		return this.link('#/view/'+data.PrincipalName, '', row, cell, value);
	},
	edit: function(row, cell, value, field, data) {
		return this.action('#/edit/'+data.PrincipalName, data.PrincipalName ,'icon-pencil', row, cell, value, 'Edit');
	},
	'delete': function(row, cell, value, field, data) {
		return this.action('', data.PrincipalName, 'icon-remove', row, cell, value,'Remove dealer/advisor');
	},
	editField: function(row, cell, value, field, data) {
		return this.action('', data.Reference, '', row, cell, 'configure','Configure Field');
	},
	// Renders fields as a content-specific link i.e. telephone or email
	email: function(row, cell, value) {
		return this.link('mailto:'+value, '', row, cell, value);
	},
	telephone: function(row, cell, value) {    
		return this.link('tel:'+value, '', row, cell, (value != null? value.toString().replace(/(\d{3})(\d{3})(\d{4})/g,"($1) $2-$3"):value));
	},
	area: function(row, cell, value, field, data) {
		return this.link('#/view/'+data.PrincipalName, '', row, cell, (value * 0.0002471).toFixed(2));
	},
	checkbox: function(row, cell, value, field, data){
		return ('<input type="checkbox" style="" name="dealer" value="' + data.PrincipalName + '" />');
	}
};
_.each(formatters, function(f, n, o) { o[n] = _.bind(f, this); }, formatters);

module.exports = SlickGridView;
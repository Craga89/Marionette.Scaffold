path = require 'path'

exports.config =
	
	# Edit the next line to change default build path.
	paths:
		public: 'public'
	
	files:
		javascripts:
			# Defines what file will be generated with `brunch generate`.
			defaultExtension: 'js'
			
			# Describes how files will be compiled & joined together.
			# Available formats:
			# * 'outputFilePath'
			# * map of ('outputFilePath': /regExp that matches input path/)
			# * map of ('outputFilePath': function that takes input path)
			joinTo:
				'javascripts/app.js': /^app[\\/](?!config[\\/]overrides)/
				'javascripts/vendor.js': /^(vendor|app[\\/]config[\\/]overrides)/
				'test/javascripts/test.js': /^test[\\/](?!vendor)/
				'test/javascripts/test-vendor.js': /^test[\\/](?=vendor)/
			
			# Defines compilation order.
			# `vendor` files will be compiled before other ones
			# even if they are not present here.
			order:
				before: [
					# Shims
					'vendor/scripts/console-helper.js',

					# Hard dependancies
					'vendor/scripts/underscore-1.4.4.js',
					'vendor/scripts/backbone-1.0.0.js',
					'vendor/scripts/backbone.model-binder.js',
					'vendor/scripts/backbone.marionette.js',
					'vendor/scripts/backbone-super.js',
					
					# Bootstrap specific
					'vendor/scripts/bootstrap/tooltip.js',
					'vendor/scripts/bootstrap/transition.js',
					'vendor/scripts/bootstrap/affix.js',
					'vendor/scripts/bootstrap/alert.js',
					'vendor/scripts/bootstrap/button.js',
					'vendor/scripts/bootstrap/carousel.js',
					'vendor/scripts/bootstrap/collapse.js',
					'vendor/scripts/bootstrap/dropdown.js',
					'vendor/scripts/bootstrap/modal.js',
					'vendor/scripts/bootstrap/popover.js',
					'vendor/scripts/bootstrap/scrollspy.js',
					'vendor/scripts/bootstrap/tab.js',
					'vendor/scripts/bootstrap/typeahead.js'
					
				]
				after: [ 'test/vendor/scripts/test-helper.js' ]

		stylesheets:
			defaultExtension: 'less'
			joinTo: 
				'stylesheets/app.css': /^app/
				'stylesheets/vendor.css': /^vendor/
				'test/stylesheets/test.css': /^test/

			order:
				before: [
					'vendor/styles/bootstrap/bootstrap.less',
					'vendor/styles/prefixer.less'
				]
				
		templates:
			defaultExtension: 'jade'
			joinTo: 'javascripts/app.js'

	conventions:
		vendor: /(vendor|app[\\/]config[\\/]overrides)[\\/]/

	plugins:
		jshint:
			options:
				eqnull: true
				expr: true
				es3: true
			globals:
				$: true
				jQuery: true
				Backbone: true
				Marionette: true
				App: true

		uglify:
			mangle: true
			compress:
				global_defs:
					$: false
					jQuery: false
					Backbone: false
					Marionette: false
					App: false

	# Optimize outputs
	optimize: false
	minify: true

	# Change this if you're using something other than backbone (e.g. 'ember').
	# Content of files, generated with `brunch generate` depends on the setting.
	framework: 'backbone'
	
	# Settings of web server that will run with `brunch watch [--server]`.
	server:
		# Path to your server node.js module.
		path: 'server.coffee'
		port: 4000
		
		# Run even without `--server` option?
		run: yes

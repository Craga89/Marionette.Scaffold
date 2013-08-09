(function() {
	var formSelector = 'form.storable',
		inputSelector = ':input',
		checked = 'checked';

	// Ensure localStorage is available
	if(!Modernizr.localstorage) { return; }

	// Unique ID generator for localStorage keys
	function id(input) {
		return input.form && (input.form.action + '_' + input.name) || null;
	}

	function restoreInput() {
		var input = $(this),
			value = localStorage.getItem( id(this) );

		if(value && !input.val() && !input.is('[readonly]') && input.attr('autocomplete') !== 'off') {
			if(input.is(':checkbox')) {
				input[ value === checked ? 'attr' : 'removeAttr' ](
					checked, checked
				);
			}
			else {
				input.val(value);
			}
			input.trigger('change');
		}
	}

	// Geeric restore method. Takes a form or input as it's context
	function restore() {
		return this.each(function() {
			var elem = $(this);
			if( elem.is(formSelector) ) {
				$(inputSelector, this).each(restoreInput);
			}
			else if( elem.is(inputSelector) ) {
				restoreInput.call(this);
			}
		});
	}
	
	// Helper method
	$.fn.restore = function() {
		if(!this.closest(formSelector).length) { return this; }
		else { return restore.call(this); }
	};
	$.fn.clear = function() {
		$(inputSelector, this).add(this).each(function() {
			localStorage.removeItem( id(this) );
		});
	}

	// Store each input change
	$(document).on('change input', formSelector+' '+inputSelector, function() {
		// Store the input by name
		var input = $(this);
		localStorage.setItem( id(this), input.is(':checkbox') ? input.attr(checked) : input.val() );
	})

	// Clear localStorage on successful submission
	.on('submit', formSelector, function() {
		if(!event.isDefaultPrevented()) {
			$(this).clear();
		}
	});

	// Restore on document.ready
	$(function() { $(formSelector).restore(); });
}());
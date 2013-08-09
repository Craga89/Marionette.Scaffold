/* ==========================================================
 * bootstrap-formhelpers-phone.js
 * https://github.com/vlamanna/BootstrapFormHelpers
 * ==========================================================
 * Copyright 2012 Vincent Lamanna
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
 
 !function ($) {
	"use strict"; // jshint ;_;

 	/* PHONE CLASS DEFINITION
	* ====================== */
	var BFHPhone = function (element, options) {
		this.options = $.extend({}, $.fn.bfhphone.defaults, options);
		this.$element = $(element);

		if (this.$element.is(':input')) {
			var country = this.options.country;
			var formObject = this.$element.closest('form');
			
			if (country != "") {
				var countryObject = formObject.find('#' + country);
		
				this.options.format = BFHPhoneFormatList[
					countryObject.length != 0 ? countryObject.val() : country
				];
			}
			
			this.addFormatter();
		}
		
		else {
			this.displayFormatter();
		}
	}

	BFHPhone.prototype = {
		constructor: BFHPhone,

		getFormattedNumber: function() {
			var format = this.options.format,
				phoneNumber = new String(this.options.number),
				formattedNumber = "",
				newNumber, i, j = 0;
			
			newNumber = "";
			for (i = 0; i < phoneNumber.length; i++) {
				if (/[0-9]/.test(phoneNumber.charAt(i))) {
					newNumber += phoneNumber.charAt(i)
				}
			}
			phoneNumber = newNumber;
			
			for (i = 0; i < format.length; i++) {
				if (/[0-9]/.test(format.charAt(i))) {
					if (format.charAt(i) == phoneNumber.charAt(j)) {
						formattedNumber += phoneNumber.charAt(j)
						j++
					} else {
						formattedNumber += format.charAt(i)
					}
				} else if (format.charAt(i) != "d") {
					if (phoneNumber.charAt(j) != "" || format.charAt(i) == "+") {
						formattedNumber += format.charAt(i)
					}
				} else {
					if (phoneNumber.charAt(j) == "") {
						formattedNumber += ""
					} else {
						formattedNumber += phoneNumber.charAt(j)
						j++
					}
				}
			}
			
			return formattedNumber;
		},
		
		addFormatter: function () {
			var formattedNumber = this.getFormattedNumber();
			
			this.$element.addClass('disabled')
				.val(formattedNumber)
				.removeClass('disabled');
		},
		
		displayFormatter: function () {
			this.$element.html( this.getFormattedNumber() );
		},
		
		changeCountry: function (e) {
			var $this = $(this),
				phoneObject = $(this).data('bfhphone');
			
			phoneObject.options.format = BFHPhoneFormatList[$this.val()]
			
			phoneObject.addFormatter()
		},
		
		change: function(e) {
			var $this = $(this).data('bfhphone'),
				number, newNumber, i;
			
			if ($this.$element.is('.disabled, :disabled')) { return false; }
			
			number = $this.$element.val()
			newNumber = ""
			for (i = 0; i < number.length; i++) {
				if (/[0-9]/.test(number.charAt(i))) {
					newNumber += number.charAt(i)
				}
			}
			
			$this.options.number = newNumber;
			$this.addFormatter();
			$this.$element.data('number', $this.options.number);
		}
	}

 	/* PHONE PLUGIN DEFINITION
	* ======================= */
	$.fn.bfhphone = function (option) {
		return this.each(function () {
			var $this = $(this), 
				data = $this.data('bfhphone'),
				options = typeof option == 'object' && option;

			if (!data) {
				$this.data('bfhphone', (data = new BFHPhone(this, options)));
			}
			if (typeof option == 'string') {
				data[option]();
			}
		})
	}

	$.fn.bfhphone.Constructor = BFHPhone

	$.fn.bfhphone.defaults = {
		format: "",
		number: "",
		country: ""
	}

 	/* PHONE DATA-API
	* ============== */
	$(window).on('load', function () {
		$('form .bfh-phone').filter('input[type="tel"], input[type="text"], span').each(function () {
			var $phone = $(this);
			$phone.bfhphone( $phone.data() );
		});
	});
	
	$(function () {
		$('body')
			.on('propertychange.bfhphone.data-api change.bfhphone.data-api input.bfhphone.data-api keyup.bfhphone.data-api paste.bfhphone.data-api', '.bfh-phone', BFHPhone.prototype.change)
			.on('change.bfhphone.data-api', '.bfh-country', BFHPhone.prototype.changeCountry);
	});

}(window.jQuery);
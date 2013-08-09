(function($) {
    function getValue(input) {
        return input.is(':checkbox') ? 
            input.is(':checked') : 
        input.is('.bfh-phone') ? 
            input.data('number') : 
        input.val() || '';
    }
    
    $.fn.jsonify = function(options) {
        var settings = $.extend({
            stringify: false
        }, options);
        var json = {};
        this.each(function() {
            var form = this;
            $.each( $(this).serializeArray(), function() {
                var input = $(form).find('input[name="'+this.name+'"]'),
                    value = getValue(input);
                    
                if (json[this.name]) {
                    if (!json[this.name].push) json[this.name] = [json[this.name]];
                    json[this.name].push( value );
                } else {
                    json[this.name] = value;
                }
            });
        });
        if (settings.stringify) return JSON.stringify(json);
        else return json;
    };
})(jQuery); 
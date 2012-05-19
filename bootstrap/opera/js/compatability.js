/* Fixes for Opera using Chrome Humpinator */
var jQuery = $ = window.jQuery;
var navigator = window.navigator;
var localStorage = window.localStorage;

var chrome = {
	extension: {
		getURL: function(filename) {
			return 'js/chrome/' + filename;
		}
	}
};
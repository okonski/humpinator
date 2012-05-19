#!/bin/bash
echo Updating CSS
cp ../../src/css/humpinator.css ./styles/

echo Compiling JS
cat js/threads-replies.js \
	../../src/jquery.min.js \
	js/compatability.js \
	../../src/jquery.imagesloaded.min.js \
> includes/humpinator.js

# Add a document.ready in a proper closure
echo ';(function($) { $(document).ready(function() {' >> includes/humpinator.js


cat ../../src/utils.js \
	../../src/humpinator.js \
	../../src/menu.js \
>> includes/humpinator.js

# And make sure we close that
echo '}); })(window.jQuery);' >> includes/humpinator.js

# And create the ZIP..err OEX

echo Creating Opera Extension
rm ../humpinator.oex 2> /dev/null
zip ../humpinator.oex * -q -r -0

echo All done.

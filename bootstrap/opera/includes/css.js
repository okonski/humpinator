// ==UserScript==
// @include http://*nfohump.com/forum/*
// ==/UserScript==
window.addEventListener('load', function() {
    var path = 'styles/humpinator.css';

    var onCSS = function(event) {
        var message = event.data;

        if (message.topic === 'LoadedInjectedCSS' && message.data.path === path) {
            opera.extension.removeEventListener('message', onCSS, false);

            var css = message.data.css;

            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    };

    opera.extension.addEventListener('message', onCSS, false);
	opera.extension.postMessage({ topic: 'LoadInjectedCSS', data: path });
}, false);
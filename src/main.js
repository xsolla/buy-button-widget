var _ = require('lodash');
var $ = require('jquery');
var App = require('application');

module.exports = (function () {
    return {
        init: function () {
            var app = new App();
            app.init.apply(app, arguments);
            return app;
        },
        $: $
    };
})();

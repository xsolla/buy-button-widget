var App = require('./application');
var version = require('./version');
var Helpers = require('./helpers');
var polyfills = require('./polyfills');

polyfills.applyPolyfills();

module.exports = (function () {
    return {
        create: function () {
            var app = new App();
            app.init.apply(app, arguments);

            return Helpers.zipObject(['open', 'on', 'off'].map(function (methodName) {
                return [methodName, function () {
                    return app[methodName].apply(app, arguments);
                }];
            }));
        },
        version: version,
        eventTypes: App.eventTypes,
        backgroundTypes: App.backgroundTypes,
        foregroundTypes: App.foregroundTypes,
    };
})();

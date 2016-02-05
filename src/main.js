var _ = require('lodash');
var $ = require('jquery');
var App = require('application');
var version = require('version');

module.exports = (function () {
    return {
        create: function () {
            var app = new App();
            app.init.apply(app, arguments);

            return _.object(_.map(['open', 'on', 'off'], function (methodName) {
                return [methodName, function () {
                    return app[methodName].apply(app, arguments);
                }];
            }));
        },
        version: version,
        eventTypes: App.eventTypes,
        $: $,
        _: _
    };
})();

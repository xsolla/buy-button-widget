var _ = require('lodash');
var $ = require('jquery');
var GDApp = require('gd-app');

var instance;

module.exports = (function () {
    var getInstance = function () {
        if (!instance) {
            instance = new GDApp();
        }
        return instance;
    };

    return _.extend(_.object(_.map(['init'/*, 'open', 'on', 'off'*/], function (methodName) {
        var app = getInstance();
        return [methodName, function () {
            return app[methodName].apply(app, arguments);
        }];
    })), {$: $});
})();

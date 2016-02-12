var _ = require('lodash');

module.exports = function (message) {
    this.message = message;
    this.name = "XsollaPay2PlayWidgetException";
    this.toString = _.bind(function () {
        return this.name + ': ' + this.message;
    }, this);
};

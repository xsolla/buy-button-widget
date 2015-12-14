var _ = require('lodash');

module.exports = function (message) {
    this.message = message;
    this.name = "XsollaGameDeliveryWidgetException";
    this.toString = _.bind(function () {
        return this.name + ': ' + this.message;
    }, this);
};

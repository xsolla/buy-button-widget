var $ = require('jquery');
var _ = require('lodash');

module.exports = (function () {
    function Api(data) {
        this.data = data || {};
    }

    var PAYSTATION_API_URL = 'http://ps-a-salnikov.user/paystation2/api/';

    /**
     * Perform request to PayStation API
     */
    Api.prototype.request = function (route, data) {
        return $.ajax(PAYSTATION_API_URL + route, {
            cache: false,
            dataType: 'json',
            method: 'POST',
            data: _.extend(this.data, data || {})
        });
    };

    return Api;
})();

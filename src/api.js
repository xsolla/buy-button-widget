var $ = require('jquery');
var _ = require('lodash');

module.exports = (function () {
    function Api(data, options) {
        this.data = data || {};
        this.config = _.extend({
            sandbox: false
        }, options);
    }

    var PAYSTATION_API_URL = 'https://test2-secure.xsolla.com/paystation2/api/';
    var SANDBOX_PAYSTATION_API_URL = 'https://sandbox-secure.xsolla.com/paystation2/api/';

    /**
     * Perform request to PayStation API
     */
    Api.prototype.request = function (route, data) {
        var deferred = $.Deferred();

        $.ajax((this.config.sandbox ? SANDBOX_PAYSTATION_API_URL : PAYSTATION_API_URL) + route, {
            cache: false,
            dataType: 'json',
            method: 'POST',
            data: _.extend(this.data, data || {})
        }).done(function (data) {
            if ((data.api || {}).ver !== '1.0.1') {
                // Non PayStation API answer
                deferred.reject([{support_code: '20000002'}]);
                return;
            }

            delete data.api;

            deferred.resolve(data);
        }).fail(function (jqXHR) {
            // HTTP Error, Fatal PayStation API error
            deferred.reject(jqXHR.responseJSON && jqXHR.responseJSON.errors || [{support_code: '20000001'}]);
        });

        return deferred;
    };

    return Api;
})();

module.exports = (function () {
    function Api(data, options) {
        this.data = data || {};
        this.config = Object.assign({
            sandbox: false,
            host: 'secure.xsolla.com'
        }, options)
    }

    var getPaystationApiUrl = function (sandbox, host) {
        var SANDBOX_PAYSTATION_API_URL = 'https://sandbox-secure.xsolla.com/paystation2/api/';
        return sandbox ? SANDBOX_PAYSTATION_API_URL : 'https://' + host + '/paystation2/api/';
    };

    /**
     * Perform request to PayStation API
     */
    Api.prototype.request = function (route, data) {
        var apiUrl = getPaystationApiUrl(this.config.sandbox, this.config.host);
        var url = apiUrl + route;

        var postData = (Object.assign(this.data, data || {}));

        var searchParams = Object.keys(postData).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]);
          }).join('&');

        return new Promise((function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            request.send(searchParams);

            request.onreadystatechange = function() {
                if (request.readyState === 4) {

                    var jsonResponse = JSON.parse(request.responseText);

                    if (this.status !== 200) {
                        reject(jsonResponse && jsonResponse.errors || [{support_code: '20000001'}]);
                    }

                    if ((jsonResponse.api || {}).ver !== '1.0.1') {
                        // Non PayStation API answer
                        reject([{support_code: '20000002'}]);
                        return;
                    }

                    delete jsonResponse.api;

                    resolve(jsonResponse);
                  }
            }

        }).bind(this));
    };

    return Api;
})();

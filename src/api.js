const Helpers = require('./helpers');

module.exports = (function () {
    function Api(options) {
        this.config = options;
    }

    Api.prototype.initRequest = function (project_id, data) {
        return new Promise((function (resolve, reject) {
            const url = `https://${this.config.api_host}/v2/project/${project_id}/widget/init`;
            const searchParams = Helpers.buildQueryString(data);

            const request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            request.send(searchParams);

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    const jsonResponse = JSON.parse(request.responseText);

                    if (this.status !== 200) {
                        reject(jsonResponse);
                    }

                    resolve(jsonResponse);
                }
            }

        }).bind(this))
    };

    return Api;
})();

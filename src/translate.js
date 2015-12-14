var Polyglot = require('polyglot');

var polyglot;

module.exports = (function () {
    return {
        init: function (translations) {
            polyglot = new Polyglot({phrases: translations});
        },
        translate: function () {
            if (!polyglot) {
                return null;
            }

            return polyglot.t.apply(polyglot, arguments);
        }
    };
})();

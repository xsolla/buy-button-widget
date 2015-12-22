var _ = require('lodash');
var React = require('react');
var ReactDOMServer = require('react-dom-server');
var Translate = require('../translate.js');

var TranslateMessage = React.createClass({
    render: function () {
        var values = this.props.values;
        _.each(values, function (value, index) {
            if (React.isValidElement(value)) {
                values[index] = ReactDOMServer.renderToStaticMarkup(value);
            }
        });

        return <span dangerouslySetInnerHTML={{__html: Translate.translate(this.props.message, values)}} />;
    }
});
module.exports = TranslateMessage;

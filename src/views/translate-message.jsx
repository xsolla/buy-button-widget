var React = require('react');
var Translate = require('../translate.js');

var TranslateMessage = React.createClass({
    render: function () {
        return <span dangerouslySetInnerHTML={{__html: Translate.translate(this.props.message, this.props.values)}} />;
    }
});
module.exports = TranslateMessage;

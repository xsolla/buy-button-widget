var React = require('react');
var xsollaLogoSVG = require('./images/xsolla-logo.svg');

var XsollaLogoView = React.createClass({
    render: function () {
        return <span dangerouslySetInnerHTML={{__html: xsollaLogoSVG}} />;
    }
});
module.exports = XsollaLogoView;

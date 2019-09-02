var React = require('react');
var CreateReactClass = require('create-react-class');
var xsollaLogoSVG = require('./images/xsolla-logo.svg');

var XsollaLogoView = CreateReactClass({
    render: function () {
        return <span dangerouslySetInnerHTML={{__html: xsollaLogoSVG}} />;
    }
});
module.exports = XsollaLogoView;

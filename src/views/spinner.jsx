var React = require('react');
var CreateReactClass = require('create-react-class');
var spinnerSVG = require('spinners/round.svg');

var SpinnerView = CreateReactClass({
    render: function () {
        return <span className="spinner" dangerouslySetInnerHTML={{__html: spinnerSVG}} />;
    }
});
module.exports = SpinnerView;

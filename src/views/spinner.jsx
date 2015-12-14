var React = require('react');
var spinnerSVG = require('spinners/round.svg');

var SpinnerView = React.createClass({
    render: function () {
        return <span className="spinner" dangerouslySetInnerHTML={{__html: spinnerSVG}} />;
    }
});
module.exports = SpinnerView;

/** @jsx React.DOM */
'use strict';

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var OnClickOutside = require('react-onclickoutside');

var TetheredElement = require('./TetheredElement');

var TetherTarget = React.createClass({
    mixins: [
        OnClickOutside
    ],

    propTypes: {
        tethered: React.PropTypes.node.isRequired,
        tetherOptions: React.PropTypes.object.isRequired
    },

    componentDidMount: function () {
        var tetherOptions = _.merge({
            target: ReactDOM.findDOMNode(this)
        }, this.props.tetherOptions);
        this.tethered = new TetheredElement(this.props.tethered, tetherOptions);
    },

    componentWillUnmount: function () {
        this.tethered.destroy();
    },

    componentDidUpdate: function () {
        this.tethered.update();
    },

    handleClickOutside: function(evt) {
        this.tethered.hide();
    },

    render: function () {
        var divProps = _.omit(this.props, ['tethered', 'tetherOptions']);

        if (this.props.toggleOnClick) {
            divProps.onClick = _.bind(function () {
                this.tethered.toggle();
            }, this);
        }

        if (this.props.toggleOnMouse) {
            divProps.onMouseEnter = _.bind(function () {
                this.tethered.show();
            }, this);

            divProps.onMouseLeave = _.bind(function () {
                this.tethered.hide();
            }, this);
        }

        return <div {... divProps }>
            { this.props.children }
        </div>;
    }
});

module.exports = TetherTarget;

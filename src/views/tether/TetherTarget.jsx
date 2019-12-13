/** @jsx React.DOM */
'use strict';

var React = require('react');
var CreateReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var OnClickOutside = require('react-onclickoutside');

var TetheredElement = require('./TetheredElement');

var TetherTarget = CreateReactClass({
    mixins: [
        OnClickOutside
    ],

    propTypes: {
        tethered: React.PropTypes.node.isRequired,
        tetherOptions: React.PropTypes.object.isRequired
    },

    componentDidMount: function () {
        var tetherOptions = Object.assign({
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
        var restProps = Object.keys(this.props)
            .filter((key) => ['tethered', 'tetherOptions'].indexOf(key) < 0)
            .reduce((newObj, key) => Object.assign(newObj, { [key]: this.props[key] }), {})

        var divProps = restProps;
        var handles = {};

        if (this.props.toggleOnClick) {
            handles.onClick = (function () {
                this.tethered.toggle();
            }).bind(this);
        }

        if (this.props.toggleOnMouse) {
            handles.onMouseEnter = (function () {
                this.tethered.show();
            }).bind(this);

            handles.onMouseLeave = (function () {
                this.tethered.hide();
            }).bind(this);
        }

        return <div { ...divProps } { ...handles }>
            { this.props.children }
        </div>;
    }
});

module.exports = TetherTarget;

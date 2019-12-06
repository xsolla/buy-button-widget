'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Tether = require('tether');

// NOTE: This is not a React component. It's a plain JS object that manages a React component.

function TetheredElement(reactComponent, tetherOptions) {
    this.reactComponent = reactComponent;
    this.classPrefix = 'xpay2Play-widget-tether';

    this.domNode = document.createElement('div');
    this.domNode.style.position = 'absolute'; // needed for Tether
    document.body.appendChild(this.domNode);

    this.tether = new Tether(Object.assign({
        element: this.domNode,
        classPrefix: this.classPrefix
    }, tetherOptions));

    this.update();
}

TetheredElement.prototype.toggle = function () {
    this.domNode.classList.toggle(this.classPrefix + '__visible');
    this.tether.position();
};

TetheredElement.prototype.hide = function () {
    this.domNode.classList.remove(this.classPrefix + '__visible');
    this.tether.position();
};

TetheredElement.prototype.show = function () {
    this.domNode.classList.add(this.classPrefix + '__visible');
    this.tether.position();
};

TetheredElement.prototype.update = function () {
    ReactDOM.render(
        React.createElement('div', {className: this.classPrefix + '-content'}, this.reactComponent),
        this.domNode,
        (function () {
            this.tether.position()
        }.bind(this))
    );
};

TetheredElement.prototype.destroy = function () {
    React.unmountComponentAtNode(this.domNode);
    this.domNode.parentNode.removeChild(this.domNode);
    this.tether.destroy();
};

module.exports = TetheredElement;

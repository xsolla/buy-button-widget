var $ = require('jquery');
var _ = require('lodash');
var PaystationEmbedApp = require('paystation-embed-app');
var GDException = require('gd-exception');
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = (function () {
    function GDApp() {
        require('styles/widget.scss');

        this.config = _.extend({}, DEFAULT_CONFIG);
        this.eventObject = $({});
        this.isInitiated = false;
        this.targetElement = null;
    }

    var DEFAULT_CONFIG = {
        access_token: null
    };

    /** Private Members **/
    GDApp.prototype.config = {};
    GDApp.prototype.isInitiated = false;
    GDApp.prototype.eventObject = $({});

    GDApp.prototype.checkConfig = function () {
        if (_.isEmpty(this.config.access_token)) {
            this.throwError('No access token given');
        }

        if (_.isEmpty(this.config.target_element)) {
            this.throwError('No target element given');
        }

        if (!$(this.config.target_element).length) {
            this.throwError('Target element doesn\'t exist in the DOM');
        }
    };

    GDApp.prototype.checkApp = function () {
        if (_.isUndefined(this.isInitiated)) {
            this.throwError('Initialize widget before opening');
        }
    };

    GDApp.prototype.throwError = function (message) {
        throw new GDException(message);
    };

    GDApp.prototype.triggerEvent = function () {
        this.eventObject.trigger.apply(this.eventObject, arguments);
    };

    /**
     * Initialize widget with options
     * @param options
     */
    GDApp.prototype.init = function (options) {
        this.isInitiated = true;
        this.config = _.extend({}, DEFAULT_CONFIG, options);
        this.checkConfig();

        PaystationEmbedApp.init({
            access_token: options.access_token
        });

        this.targetElement = $(options.target_element);

        this.render();

        this.triggerEvent('init');
    };

    /**
     * Open payment interface (PayStation)
     */
    GDApp.prototype.open = function () {
        this.checkApp();

        PaystationEmbedApp.open();
    };

    /**
     * Attach an event handler function for one or more events to the widget
     * @param event One or more space-separated event types (init, open, load, close, status, status-invoice, status-delivering, status-troubled, status-done)
     * @param handler A function to execute when the event is triggered
     */
    GDApp.prototype.on = function (event, handler) {
        if (!_.isFunction(handler)) {
            return;
        }

        this.eventObject.on(event, handler);
    };

    /**
     * Remove an event handler
     * @param event One or more space-separated event types
     * @param handler A handler function previously attached for the event(s)
     */
    GDApp.prototype.off = function (event, handler) {
        this.eventObject.off(event, handler);
    };

    /**
     * Render widget template
     */
    GDApp.prototype.render = function () {
        var TinyView = require('views/layouts/tiny.jsx');
        ReactDOM.render(React.createElement(TinyView, null), this.targetElement.get(0));
    };

    return GDApp;
})();

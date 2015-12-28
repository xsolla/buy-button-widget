var $ = require('jquery');
var _ = require('lodash');
var PaystationEmbedApp = require('paystation-embed-app');
var Api = require('api');
var Exception = require('exception');
var React = require('react');
var ReactDOM = require('react-dom');
var Translate = require('translate');

module.exports = (function () {
    function App() {
        require('styles/widget.scss');

        this.config = _.extend({}, DEFAULT_CONFIG);
        this.eventObject = $({});
        this.isInitiated = false;
        this.targetElement = null;
    }

    var DEFAULT_CONFIG = {
        access_token: null,
        template: 'tiny'
    };

    App.eventTypes = _.extend({}, PaystationEmbedApp.eventTypes);

    /** Private Members **/
    App.prototype.config = {};
    App.prototype.isInitiated = false;
    App.prototype.eventObject = $({});

    App.prototype.checkConfig = function () {
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

    App.prototype.checkApp = function () {
        if (_.isUndefined(this.isInitiated)) {
            this.throwError('Initialize widget before opening');
        }
    };

    App.prototype.throwError = function (message) {
        throw new Exception(message);
    };

    App.prototype.triggerEvent = function () {
        this.eventObject.trigger.apply(this.eventObject, arguments);
    };

    /**
     * Initialize widget with options
     * @param options
     */
    App.prototype.init = function (options) {
        this.isInitiated = true;
        this.config = _.extend({}, DEFAULT_CONFIG, options);
        this.checkConfig();

        this.targetElement = $(options.target_element);

        this.api = new Api({
            access_token: options.access_token
        }, {
            sandbox: options.sandbox
        });

        this.render();

        this.triggerEvent('init');
    };

    /**
     * Open payment interface (PayStation)
     */
    App.prototype.open = function (params) {
        this.checkApp();

        PaystationEmbedApp.init({
            access_token: this.config.access_token,
            sandbox: this.config.sandbox,
            lightbox: this.config.lightbox,
            childWindow: this.config.childWindow
        });

        // Register events (forwarding)
        var events = _.values(App.eventTypes).join(' ');
        var eventHandler = _.bind(function () {
            this.triggerEvent.apply(this, arguments);
        }, this);
        PaystationEmbedApp.on(events, eventHandler);

        var openHandler = _.bind(function (event) {
            var instanceId = (params || {}).instance_id;
            if (instanceId) {
                PaystationEmbedApp.sendMessage('set-data', {
                    settings: {
                        payment_method: instanceId
                    }
                });
            }
        }, this);
        PaystationEmbedApp.on('load', openHandler);

        // Unregister events
        PaystationEmbedApp.on('close', _.bind(function (event) {
            PaystationEmbedApp.off(event);
            PaystationEmbedApp.off('load', openHandler);
            PaystationEmbedApp.off(events, eventHandler);
        }, this));

        PaystationEmbedApp.open();
    };

    /**
     * Attach an event handler function for one or more events to the widget
     * @param event One or more space-separated event types (init, open, load, close, status, status-invoice, status-delivering, status-troubled, status-done)
     * @param handler A function to execute when the event is triggered
     */
    App.prototype.on = function (event, handler) {
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
    App.prototype.off = function (event, handler) {
        this.eventObject.off(event, handler);
    };

    /**
     * Render widget template
     */
    App.prototype.render = function () {
        var view;

        switch (this.config.template) {
            case 'full':
                view = require('views/layouts/full.jsx');
                break;
            case 'compact':
                view = require('views/layouts/compact.jsx');
                break;
            case 'tiny':
            default:
                view = require('views/layouts/tiny.jsx');
                break;
        }

        var props = {
            data: {},
            onPaymentOpen: _.bind(function(params) {
                this.open(params);
            }, this)
        };

        var updateView = _.bind(function () {
            ReactDOM.render(React.createElement(view, props), this.targetElement.get(0));
        }, this);

        updateView();

        this.api.request('gamedelivery/init').done(function (data) {
            var info = data.digital_content || {};

            props.data = {
                amount: {
                    value: _(info.drm).pluck('amount').min(),
                    currency: (_.first(info.drm) || {}).currency,
                    hasDifferent: _.uniq(_.pluck(info.drm, 'amount')).length > 1
                },
                name: info.name,
                description: info.description,
                systemRequirements: info.system_requirements,
                drm: info.drm,
                logoUrl: info.image_url,
                paymentList: data.payment_instances
            };

            Translate.init(data.translates || {});

            updateView();
        }).fail(function (errors) {
            props.data = {
                errors: errors
            };

            updateView();
        });
    };

    return App;
})();

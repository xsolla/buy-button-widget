var $ = require('jquery');
var _ = require('lodash');
var PaystationEmbedApp = require('paystation-embed-app');
var Api = require('./api');
var Exception = require('exception');
var React = require('react');
var ReactDOM = require('react-dom');
var Translate = require('./translate');

module.exports = (function () {
    function App() {
        this.config = _.extend({}, DEFAULT_CONFIG);
        this.eventObject = $({});
        this.isInitiated = false;
        this.targetElement = null;
    }

    var DEFAULT_CONFIG = {
        access_token: null,
        access_data: null,
        color: 'default',
        template: 'tiny'
    };

    App.eventTypes = _.extend({}, PaystationEmbedApp.eventTypes);

    /** Private Members **/
    App.prototype.config = {};
    App.prototype.isInitiated = false;
    App.prototype.eventObject = $({});

    App.prototype.checkConfig = function () {
        if (_.isEmpty(this.config.access_token) && _.isEmpty(this.config.access_data)) {
            this.throwError('No access token or access data given');
        }

        if (!_.isEmpty(this.config.access_data) && !_.isPlainObject(this.config.access_data)) {
            this.throwError('Invalid access data format');
        }

        if (_.isEmpty(this.config.target_element)) {
            this.throwError('No target element given');
        }

        if (!$(this.config.target_element).length) {
            this.throwError('Target element doesn\'t exist in the DOM');
        }

        if (this.config.color !== 'dark' && this.config.color !== 'default') {
            this.config.color = 'default';
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

    App.prototype.setUpTheme = function () {
        if (this.config.color === 'dark') {
            require('./styles/widget-dark.scss');
        } else {
            require('./styles/widget-default.scss');
        }
    };

    /**
     * Initialize widget with options
     * @param options
     */
    App.prototype.init = function (options) {
        this.isInitiated = true;
        this.config = _.extend({}, DEFAULT_CONFIG, options);
        this.checkConfig();
        this.setUpTheme();

        this.targetElement = $(options.target_element);

        var request = {
            fail_locale: 'en'
        };

        if (options.access_token) {
            request.access_token = options.access_token;
        } else {
            request.access_data = JSON.stringify(options.access_data);
        }

        this.api = new Api(request, {
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

        var access_data = {purchase: {tips: undefined}};

        if (params.tips && params.tips.amount && params.tips.currency) {
            access_data.purchase.tips = params.tips;
        }

        PaystationEmbedApp.init({
            access_token: this.config.access_token,
            access_data: _.merge(access_data, this.config.access_data),
            sandbox: this.config.sandbox,
            lightbox: this.config.lightbox,
            childWindow: this.config.childWindow,
            host: this.config.host
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
                view = require('./views/layouts/full.jsx');
                break;
            case 'compact':
                view = require('./views/layouts/compact.jsx');
                break;
            case 'tiny':
            default:
                view = require('./views/layouts/tiny.jsx');
                break;
        }

        var props = {
            data: {},
            onPaymentOpen: _.bind(function (params) {
                this.open(params);
            }, this)
        };

        var updateView = _.bind(function () {
            ReactDOM.render(React.createElement(view, props), this.targetElement.get(0));
        }, this);

        updateView();

        this.api.request('pay2play/init').done(function (data) {
            var info = data.digital_content || {};

            props.data = {
                amount: {
                    value: info.min_amount,
                    currency: info.min_currency,
                    hasDifferent: _.uniq(_.pluck(info.drm, 'amount')).length > 1 || _.uniq(_.pluck(info.drm, 'currency')).length > 1
                },
                tips: info.tips,
                name: info.name,
                description: info.description,
                systemRequirements: info.system_requirements,
                drm: info.drm,
                logoUrl: info.image_url,
                paymentList: data.payment_instances
            };

            Translate.init(data.translates || {});

            updateView();
        }).fail(_.bind(function (errors) {
            props.data = {
                errors: errors
            };

            _.each(errors, function (error) {
                if (error.message) {
                    console.warn('XsollaPay2PlayWidget', error.support_code, error.message);
                }
            });

            updateView();
        }, this));
    };

    return App;
})();

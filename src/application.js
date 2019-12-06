var PaystationEmbedApp = require('paystation-embed-app');
var Api = require('./api');
var Helpers = require('./helpers');
var Exception = require('exception');
var React = require('react');
var ReactDOM = require('react-dom');
var Translate = require('./translate');
var XL = require('xsolla-login-app');

module.exports = (function () {
    function App() {
        this.config = Object.assign({}, DEFAULT_CONFIG);
        this.eventObject = {
            on: (function(event, handle) {
                if (!this.targetElement) {
                    return;
                }

                this.targetElement.addEventListener(event, handle);
            }).bind(this),
            off: (function(event, handle) {
                if (!this.targetElement) {
                    return;
                }

                this.targetElement.addEventListener(event, handle);
            }).bind(this)
        };
        this.isInitiated = false;
        this.targetElement = null;
        this.xsollaLoginProjectId = null;
        this.locale = null;
    }

    var DEFAULT_CONFIG = {
        access_token: null,
        access_data: null,
        theme: {
            foreground: 'blue',
            background: 'light'
        },
        host: 'secure.xsolla.com',
        login: {
            popupBackgroundColor: 'rgba(0, 0, 0, 0.64)',
            theme: null,
            iframeZIndex: 1000000
        }
    };

    App.foregroundTypes = {
        BLUE: 'blue',
        RED: 'red',
        GOLD: 'gold',
        GREEN: 'green'
    };

    App.backgroundTypes = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    App.tokenCookieName = 'xsolla_login_token';
    App.tokenParameterName = 'token';
    App.selectorCookieName = 'xsolla_login_selector';
    App.selectorParameterName = 'css_selector';

    App.eventTypes = Object.assign({}, PaystationEmbedApp.eventTypes);

    /** Private Members **/
    App.prototype.config = {};
    App.prototype.isInitiated = false;
    App.prototype.eventObject = {
        on: (function(event, handle) {
            if (!this.targetElement) {
                return;
            }

            this.targetElement.addEventListener(event, handle);
        }).bind(this),
        off: (function(event, handle) {
            if (!this.targetElement) {
                return;
            }

            this.targetElement.addEventListener(event, handle);
        }).bind(this)
    };

    App.prototype.checkConfig = function () {
        if (Helpers.isEmpty(this.config.access_token) && Helpers.isEmpty(this.config.access_data)) {
            this.throwError('No access token or access data given');
        }

        if (!Helpers.isEmpty(this.config.access_data) && typeof this.config.access_data !== 'object') {
            this.throwError('Invalid access data format');
        }

        if (Helpers.isEmpty(this.config.target_element)) {
            this.throwError('No target element given');
        }

        if (!this.config.target_element) {
            this.throwError('Target element doesn\'t exist in the DOM');
        }

        if (Helpers.isEmpty(this.config.host)) {
            this.throwError('Invalid host');
        }

        if (this.config.theme.background !== App.backgroundTypes.LIGHT && this.config.theme.background !== App.backgroundTypes.DARK) {
            this.config.theme.background = App.backgroundTypes.LIGHT;
        }

    };

    App.prototype.openXsollaLogin = function () {
        var loginPayload = {
            css_selector: this.targetElement.getAttribute('id')
        };

        var loginOptions = {
            payload: JSON.stringify(loginPayload),
            projectId: this.xsollaLoginProjectId,
            callbackUrl: document.location.href,
            locale: this.locale,
            popupBackgroundColor: this.config.login.popupBackgroundColor,
            theme: this.config.login.theme,
            iframeZIndex: this.config.login.iframeZIndex,
            route: XL.ROUTES.SOCIALS_LOGIN
        };

        XL.init(this.deepClone(loginOptions));
        XL.show();
    };

    App.prototype.openPaystation = function (params) {
        var access_data = {purchase: {tips: undefined}};

        if (params.tips && params.tips.amount && params.tips.currency) {
            access_data.purchase.tips = params.tips;
        }

        PaystationEmbedApp.init({
            access_token: this.config.access_token,
            access_data: Object.assign(access_data, this.config.access_data),
            sandbox: this.config.sandbox,
            lightbox: this.config.lightbox,
            childWindow: this.config.childWindow,
            host: this.config.host
        });

        // Register events (forwarding)
        var events = Object.values(App.eventTypes).join(' ');
        var eventHandler = (function () {
            this.triggerEvent.apply(this, arguments);
        }).bind(this);
        PaystationEmbedApp.on(events, eventHandler);

        var openHandler = (function (event) {
            var instanceId = (params || {}).instance_id;
            var tips = (params || {}).tips;
            if (instanceId || tips) {
                PaystationEmbedApp.sendMessage('set-data', {
                    settings: {
                        payment_method: instanceId,
                        tips: tips
                    }
                });
            }
        }).bind(this);

        PaystationEmbedApp.on('load', openHandler);

        // Unregister events
        PaystationEmbedApp.on('close', (function (event) {
            PaystationEmbedApp.off(event);
            PaystationEmbedApp.off('load', openHandler);
            PaystationEmbedApp.off(events, eventHandler);
            this.deleteCookie(App.selectorCookieName);
            this.deleteCookie(App.tokenCookieName);
        }).bind(this));

        PaystationEmbedApp.open();
    };

    App.prototype.checkApp = function () {
        if (this.isInitiated === undefined) {
            this.throwError('Initialize widget before opening');
        }
    };

    App.prototype.throwError = function (message) {
        throw new Exception(message);
    };

    App.prototype.triggerEvent = function () {
        [].forEach.call(arguments, (function (eventName) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, false);
            this.targetElement.dispatchEvent(event);
        }).bind(this));
    };

    App.prototype.setUpTheme = function () {
        switch (this.config.template) {
            case 'simple':
                require('./styles/base/simple.scss');
                break;
            case 'standard':
            default:
                require('./styles/base/widget.scss');
                break;
        }
    };

    App.prototype.deepClone = function (data) {
        return JSON.parse(JSON.stringify(data));
    };

    App.prototype.saveDataToCookie = function() {
        var urlParams = new URLSearchParams(window.location.search);
        var token = urlParams.get(App.tokenParameterName);

        if (token) {
            this.saveSelectorToCookie(token);
            this.saveTokenToCookie(token);
            this.removeParamFromUrl(App.tokenParameterName);
        }

    }


    App.prototype.saveTokenToCookie = function (token) {
        if (token) {
            this.setCookie(App.tokenCookieName, token);
        }
    };

    App.prototype.saveSelectorToCookie = function (token) {
        if (token) {
            var parsedJwt = this.parseJwt(token);
            if (parsedJwt && parsedJwt.payload) {
                var payload = JSON.parse(parsedJwt.payload);
            }
            var selector = payload && payload[App.selectorParameterName];

            if (selector) {
                this.setCookie(App.selectorCookieName, selector);
            }
        }
    };

    App.prototype.removeParamFromUrl = function (paramName) {
        var urlParams = new URLSearchParams(window.location.search);
        urlParams.delete(paramName);

        var url = document.location.origin
            + document.location.pathname
            + '?' + urlParams.toString()
            + document.location.hash;
        window.history.pushState({}, document.title, url);
    }

    App.prototype.getToken = function () {
        if (this.config.access_token) {
            return this.config.access_token;
        }
        return this.getCookie(App.tokenCookieName)
    };

    App.prototype.getSelector = function () {
        return this.getCookie(App.selectorCookieName)
    };

    App.prototype.needShowLogin = function () {
        return this.xsollaLoginProjectId && !this.hasAccessToken();
    };

    App.prototype.hasAccessToken = function () {
        return this.config.access_token !== null;
    };

    App.prototype.getCookie = function (name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    App.prototype.setCookie = function (name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    };

    App.prototype.deleteCookie = function (name) {
        this.setCookie(name, '', {'max-age': -1});
    };

    App.prototype.parseJwt = function (jwtToken) {
        var base64Url = jwtToken.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    /**
     * Initialize widget with options
     * @param options
     */
    App.prototype.init = function (options) {
        this.isInitiated = true;
        this.config = this.deepClone(Object.assign({}, DEFAULT_CONFIG, options));
        this.checkConfig();
        this.setUpTheme();
        this.saveDataToCookie();

        this.targetElement = document.querySelector(options.target_element);

        var request = {
            fail_locale: 'en'
        };

        if (options.access_token) {
            request.access_token = options.access_token;
        } else {
            request.access_data = JSON.stringify(options.access_data);
        }

        if (this.getToken()) {
            request.token = this.getToken()
        }

        this.api = new Api(request, {
            sandbox: options.sandbox,
            host: this.config.host
        });

        this.render();

        this.triggerEvent('init');
    };

    /**
     * Open payment interface (PayStation)
     */
    App.prototype.open = function (params) {
        this.checkApp();
        if (this.needShowLogin()) {
            this.openXsollaLogin();
        } else {
            this.openPaystation(params)
        }
    };

    /**
     * Attach an event handler function for one or more events to the widget
     * @param event One or more space-separated event types (init, open, load, close, status, status-invoice, status-delivering, status-troubled, status-done)
     * @param handler A function to execute when the event is triggered
     */
    App.prototype.on = function (event, handler) {
        if (typeof handler !== 'function') {
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
            case 'simple':
                view = require('./views/layouts/simple.jsx');
                break;
            case 'standard':
            default:
                view = require('./views/layouts/tiny.jsx');
                break;
        }

        var props = {
            data: {},
            onPaymentOpen: (function (params) {
                this.open(params);
            }).bind(this),
            paymentButtonColor: this.config.theme.foreground,
            themeColor: this.config.theme.background
        };
        var updateView = (function () {
            props.data.css_selector = this.getSelector();
            props.data.current_selector = this.targetElement.getAttribute('id');
            ReactDOM.render(React.createElement(view, props), this.targetElement);
        }).bind(this);
        var initLoginParams = (function (locale) {
            this.xsollaLoginProjectId = props.data.xsollaLoginProjectId;
            this.locale = locale;
        }).bind(this);
        var updateAccessToken = (function () {
            if (props.data.access_token !== null) {
                this.config.access_token = props.data.access_token;
                this.config.access_data = null;
            }
        }).bind(this);

        updateView();

        this.api.request('pay2play/init').then(function(data) {
            var info = data.digital_content || {};

            const uniqDrmAmount = Helpers.uniq(info.drm.map(data => data.amount));
            const uniqDrmCurrency = Helpers.uniq(info.drm.map(data => data.currency));

            props.data = {
                amount: {
                    value: info.min_amount,
                    value_without_discount: info.min_amount_without_discount,
                    currency: info.min_currency,
                    hasDifferent: uniqDrmAmount.length > 1 || uniqDrmCurrency.length > 1
                },
                tips: info.tips,
                name: info.name,
                description: info.description,
                systemRequirements: info.system_requirements,
                drm: info.drm,
                logoUrl: info.image_url,
                paymentList: data.payment_instances,
                is_released: info.is_released,
                locale: data.user.language,
                xsollaLoginProjectId: data.user.xsolla_login_id,
                access_token: data.access_token
            };

            Translate.init(data.translates || {});

            if (props.data.xsollaLoginProjectId) {
                initLoginParams(data.user.language);
                updateAccessToken();
            }

            updateView();
        }).catch(function(errors) {
            props.data = {
                errors: errors
            };

            errors.forEach((error) => {
                if (error.message) {
                    console.warn('XsollaPay2PlayWidget', error.support_code, error.message);
                }
            });

            updateView();
        })
    };

    return App;
})();

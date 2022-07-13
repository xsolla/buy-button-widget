const PaystationEmbedApp = require('paystation-embed-app');
const XL = require('xsolla-login-app');
const Exception = require('exception');
const React = require('react');
const ReactDOM = require('react-dom');

const Api = require('./api');
const Helpers = require('./helpers');
const Translate = require('./translate');
const Jwt = require('./jwt');
const Cookie = require('./cookie');

module.exports = (function () {
    const DEFAULT_ITEM_TYPE = 'digital_content';
    const DEFAULT_HOST = 'store.xsolla.com';
    const DEFAULT_API_HOST = 'store.xsolla.com/api';
    const DEFAULT_PAYSTATION_RESIZE_TIMEOUT = 2000;

    const DEFAULT_CONFIG = {
        access_token: null,
        access_data: null,
        item_type: DEFAULT_ITEM_TYPE,
        project_id: null,
        sku: null,
        drm: null,
        user: {
            xsolla_login_token: null,
            auth: null,
            locale: null
        },
        api_settings: {
            host: DEFAULT_HOST,
            api_host: DEFAULT_API_HOST,
        },
        widget_ui: {
            theme: {
                foreground: 'blue',
                background: 'light'
            },
            template: 'standard'
        },
        payment_ui: null,
        payment_widget_ui: null,
        login_ui: {
            popupBackgroundColor: 'rgba(0, 0, 0, 0.64)',
            theme: null,
            iframeZIndex: 1000000
        }
    };

    function App() {
        this.config = Object.assign({}, DEFAULT_CONFIG);
        this.eventObject = {
            on: (function (event, handle) {
                if (!this.targetElement) {
                    return;
                }

                this.targetElement.addEventListener(event, handle);
            }).bind(this),
            off: (function (event, handle) {
                if (!this.targetElement) {
                    return;
                }

                this.targetElement.removeEventListener(event, handle);
            }).bind(this)
        };
        this.isInitiated = false;
        this.targetElement = null;
        this.view = null;
        this.xsollaLoginProjectId = null;
        this.locale = null;
    }

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
    App.prototype.checkConfigForRequiredParams = function () {
        if (Helpers.isEmpty(this.config.project_id)) {
            this.throwError('No project id given');
        }

        if (Helpers.isEmpty(this.config.item_type)) {
            this.throwError('No item_type given');
        }

        if (Helpers.isEmpty(this.config.access_token)) {
            if (Helpers.isEmpty(this.config.sku)) {
                this.throwError('No sku given');
            }
        }

        if (!Helpers.isEmpty(this.config.access_data) && typeof this.config.access_data !== 'object') {
            this.throwError('Invalid access data format');
        }

        if (this.config.api_settings && Helpers.isEmpty(this.config.api_settings.host)) {
            this.config.api_settings.host = DEFAULT_HOST;
        }

        if (this.config.api_settings && this.config.api_settings.host && Helpers.isEmpty(this.config.api_settings.api_host)) {
            this.config.api_settings.api_host = this.config.api_settings.host + '/api';
        }

        if (Helpers.isEmpty(this.config.widget_ui) || Helpers.isEmpty(this.config.widget_ui.target_element)) {
            this.throwError('No target element given');
        }

        if (this.config.widget_ui && this.config.widget_ui.target_element && !document.querySelector(this.config.widget_ui.target_element)) {
            this.throwError('Target element doesn\'t exist in the DOM');
        }

        if (this.config.widget_ui) {
            if (Helpers.isEmpty(this.config.widget_ui.theme)) {
                this.config.widget_ui.theme = {};
            }

            if (!(Object.values(App.foregroundTypes).includes(this.config.widget_ui.theme.foreground))) {
                this.config.widget_ui.theme.foreground = App.foregroundTypes.BLUE;
            }

            if (!(Object.values(App.backgroundTypes).includes(this.config.widget_ui.theme.background))) {
                this.config.widget_ui.theme.background = App.backgroundTypes.LIGHT;
            }
        }

        if (Helpers.isEmpty(this.config.payment_widget_ui)) {
            this.config.payment_widget_ui = {};
        }

        this.config.payment_widget_ui.lightbox = {
            resizeTimeout: DEFAULT_PAYSTATION_RESIZE_TIMEOUT,
            ...this.config.payment_widget_ui.lightbox
        };
    };

    App.prototype.openXsollaLogin = function () {
        const loginPayload = {
            css_selector: this.targetElement.getAttribute('id')
        };

        const loginOptions = {
            payload: JSON.stringify(loginPayload),
            projectId: this.xsollaLoginProjectId,
            callbackUrl: document.location.href,
            locale: this.locale,
            popupBackgroundColor: this.config.login_ui.popupBackgroundColor,
            theme: this.config.login_ui.theme,
            iframeZIndex: this.config.login_ui.iframeZIndex,
            route: XL.ROUTES.SOCIALS_LOGIN
        };

        XL.init(Helpers.deepClone(loginOptions));
        XL.show();
    };

    App.prototype.openPaystation = function (params) {
        const buyParams = {
            project_id: Number(this.config.project_id),
            type: this.config.item_type,
            sku: this.config.sku,
            drm: this.config.drm,
            access_token: this.config.access_token,
            access_data: this.config.access_data && btoa(JSON.stringify(this.config.access_data)),
            mode: this.config.api_settings && this.config.api_settings.sandbox && 'sandbox',
            ui_settings: this.config.payment_ui && btoa(JSON.stringify(this.config.payment_ui)),
            xsolla_login_token: this.getAuthToken(),
            locale: this.config.user && this.config.user.locale,
            country: this.getCountryFromAccessData(),
            currency: this.getCurrencyFromAccessData()
        };
        Helpers.filterObject(buyParams);

        const buyUrlWithoutQueryParams = 'https://' + this.config.api_settings.host + '/pages/buy.php?';
        const buyUrl = buyUrlWithoutQueryParams + Helpers.buildQueryString(buyParams);

        PaystationEmbedApp.init({
            payment_url: buyUrl,
            embed_type: 'widget',
            lightbox: this.config.payment_widget_ui && this.config.payment_widget_ui.lightbox,
            childWindow: this.config.payment_widget_ui && this.config.payment_widget_ui.childWindow
        });

        // Register events (forwarding)
        const events = Object.keys(App.eventTypes).map(function (eventType) {
            return App.eventTypes[eventType]
        }).join(' ');
        const eventHandler = (function (event) {
            this.triggerEvent.apply(this, [event]);
        }).bind(this);
        PaystationEmbedApp.on(events, eventHandler);

        const openHandler = (function () {
            const instanceId = (params || {}).instance_id;
            const tips = (params || {}).tips;
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
        PaystationEmbedApp.on('close', function handleClose() {
            PaystationEmbedApp.off('close', handleClose);
            PaystationEmbedApp.off('load', openHandler);
            PaystationEmbedApp.off(events, eventHandler);
            Cookie.deleteCookie(App.selectorCookieName);
            Cookie.deleteCookie(App.tokenCookieName);
        });

        PaystationEmbedApp.open();
    };

    App.prototype.checkApp = function () {
        if (!this.isInitiated) {
            this.throwError('Initialize widget before opening');
        }
    };

    App.prototype.throwError = function (message) {
        throw new Exception(message);
    };

    App.prototype.triggerEvent = function () {
        [].forEach.call(arguments, (function (eventName) {
            if (typeof eventName !== 'string') {
                eventName = eventName.type;
            }
            var event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, false, false);
            this.targetElement.dispatchEvent(event);
        }).bind(this));
    };

    App.prototype.setUpTheme = function () {
        switch (this.config.widget_ui.template) {
            case 'simple':
                require('./styles/base/simple.scss');
                this.view = require('./views/layouts/simple.jsx');
                break;
            case 'standard':
            default:
                require('./styles/base/widget.scss');
                this.view = require('./views/layouts/tiny.jsx');
                break;
        }
    };

    App.prototype.reinitializeAfterLogin = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const xsollaLoginToken = urlParams.get(App.tokenParameterName);

        if (xsollaLoginToken) {
            this.saveSelectorToCookie(xsollaLoginToken);
            this.saveXsollaLoginTokenToCookie(xsollaLoginToken);
            Helpers.removeParamFromUrl(App.tokenParameterName);
        }
    };

    App.prototype.saveXsollaLoginTokenToCookie = function (xsollaLoginToken) {
        if (xsollaLoginToken) {
            Cookie.setCookie(App.tokenCookieName, xsollaLoginToken);
        }
    };

    App.prototype.saveSelectorToCookie = function (xsollaLoginToken) {
        if (xsollaLoginToken) {
            const parsedJwt = Jwt.parseJwt(xsollaLoginToken);
            if (parsedJwt && parsedJwt.payload) {
                const payload = JSON.parse(parsedJwt.payload);
                const selector = payload && payload[App.selectorParameterName];

                if (selector) {
                    Cookie.setCookie(App.selectorCookieName, selector);
                }
            }
        }
    };

    App.prototype.getAuthToken = function () {
        if (this.config.user && this.config.user.auth) {
            return this.config.user.auth;
        }

        if (this.config.user && this.config.user.xsolla_login_token) {
            return this.config.user.xsolla_login_token;
        }

        return Cookie.getCookie(App.tokenCookieName)
    };

    App.prototype.getCountryFromAccessData = function () {
        return this.config.access_data &&
            this.config.access_data.user &&
            this.config.access_data.user.country &&
            this.config.access_data.user.country.value;
    };

    App.prototype.getCurrencyFromAccessData = function () {
        return this.config.access_data &&
        this.config.access_data.settings &&
        this.config.access_data.settings.currency;
    };

    App.prototype.getSelector = function () {
        return Cookie.getCookie(App.selectorCookieName)
    };

    App.prototype.needShowLogin = function () {
        return this.xsollaLoginProjectId && !this.getAuthToken();
    };

    /**
     * Initialize widget with options
     * @param config
     */
    App.prototype.init = function (config) {
        this.isInitiated = true;
        this.config = Helpers.deepClone(Object.assign({}, DEFAULT_CONFIG, config));
        this.checkConfigForRequiredParams();
        this.setUpTheme();
        this.reinitializeAfterLogin();

        this.targetElement = document.querySelector(this.config.widget_ui.target_element);

        this.api = new Api(this.config.api_settings);

        this.render(this.config);

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
            this.openPaystation(params);
        }
    };

    /**
     * Close payment interface (PayStation)
     */
    App.prototype.close = function () {
        PaystationEmbedApp.close();
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
        const props = {
            data: {},
            onPaymentOpen: params => this.open(params),
            paymentButtonColor: this.config.widget_ui.theme.foreground,
            themeColor: this.config.widget_ui.theme.background
        };

        const updateView = () => {
            const css_selector = this.getSelector();
            const current_selector = this.targetElement.getAttribute('id');
            props.needShowPaystation = css_selector === current_selector;
            ReactDOM.render(React.createElement(this.view, props), this.targetElement);
        };
        const initLoginParams = locale => {
            this.xsollaLoginProjectId = props.data.xsollaLoginProjectId;
            this.locale = locale;
        };

        updateView();

        const initParams = {
            type: this.config.item_type,
            sku: this.config.sku,
            drm: this.config.drm,
            access_token: this.config.access_token,
            mode: this.config.api_settings && this.config.api_settings.sandbox && 'sandbox',
            locale: this.config.user && this.config.user.locale,
            country: this.getCountryFromAccessData(),
            currency: this.getCurrencyFromAccessData()
        };
        Helpers.filterObject(initParams);

        this.api.initRequest(Number(this.config.project_id), initParams, this.getAuthToken()).then(function (data) {
            props.data = {
                amount: {
                    value: data.item.amount,
                    value_without_discount: data.item.amount_without_discount,
                    currency: data.item.currency,
                    hasDifferent: data.item.has_different_prices
                },
                name: data.item.name,
                logoUrl: data.item.image_url,
                is_released: data.item.is_released,
                locale: data.user.locale,
                xsollaLoginProjectId: data.user.xsolla_login_project_id,
            };

            Translate.init(data.ui_translations || {});

            if (props.data.xsollaLoginProjectId) {
                initLoginParams(data.user.locale);
            }

            updateView();
        }).catch(function (error) {
            props.data = {
                error
            };

            if (error.errorCode && error.errorMessage) {
                console.warn('XsollaBuyButtonWidget', error.errorCode, error.errorMessage);
            }

            updateView();
        })
    };

    return App;
})();

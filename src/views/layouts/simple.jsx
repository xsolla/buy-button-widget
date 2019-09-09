var _ = require('lodash');
var React = require('react');
var CreateReactClass = require('create-react-class');
var ErrorMessageView = require('../error-message.jsx');
var PaymentButton = require('../payment-button.jsx');

var SimpleView = CreateReactClass({
    className: 'xpay2play-widget-simple',
    SHOW_TIPS_THANK_DURATION: 1000,

    getInitialState: function () {
        return {
            selectedTipIndex: -1,
            isTipsListOpened: false,
            isThankShow: false
        };
    },

    getDefaultProps: function () {
        return {
            data: {},
            paymentButtonColor: null,
            themeColor: null
        };
    },

    onPaymentOpen: function (options) {
        this.props.onPaymentOpen.call(this, options);
    },

    onTipButtonClick: function (e) {
        if (e && e.stopPropagation && e.preventDefault) {
            e.stopPropagation();
            e.preventDefault();
        }

        if (!this.state.isThankShow) {
            this.setState({isTipsListOpened: true});
        }
    },

    onTipSelect: function (index) {
        if (!_.isFinite(index)) {
            index = -1;
        }

        if (index !== -1) {
            this.setState({
                isTipsListOpened: false,
                selectedTipIndex: -1,
                isThankShow: true
            });

            setTimeout(function () {
                this.setState({
                        isTipsListOpened: false,
                        selectedTipIndex: index,
                        isThankShow: false
                    }
                )
            }.bind(this), this.SHOW_TIPS_THANK_DURATION);

        } else {
            this.setState({
                isTipsListOpened: false,
                selectedTipIndex: index,
                isThankShow: false
            });
        }
    },

    render: function () {
        var data = this.props.data;
        var isLoaded = !_.isEmpty(data);
        var errors = data.errors;
        var paymentButtonColor = this.props.paymentButtonColor;
        var themeColor = this.props.themeColor;
        var allDrmLocked = data.drm
            ? data.drm.every((function (drm) { return drm.is_locked; }))
            : false;
        var logoModifiers = [themeColor];
        var amount = data.amount;
        var showPaymentButton = amount && (amount.value || amount.value === null); // if all drm is locked amount.value = null
        var needShowPaystation = data.css_selector === data.current_selector && data.access_token !== null;
        if (this.state.isTipsListOpened) {
            logoModifiers.push('moved');
        }

        var paymentButton = showPaymentButton && (
                <PaymentButton amount={amount}
                               baseClassName={this.className}
                               tips={data.tips}
                               selectedTipIndex={this.state.selectedTipIndex}
                               isTipsListOpened={this.state.isTipsListOpened}
                               isThankShow={this.state.isThankShow}
                               paymentButtonColor={paymentButtonColor}
                               onPaymentOpen={this.onPaymentOpen}
                               isReleased={ data.is_released }
                               disabled={ allDrmLocked }
                               tagName={'div'}
                               locale={data.locale}
                               needShowPaystation={needShowPaystation}
                />
            );

        var spinner = !isLoaded && (
                <div className="spinner-simple"></div>
            );

        var errorMessage = errors && (
                <ErrorMessageView errors={errors}/>
            );

        var blockButton = isLoaded && (<div className={this.className + '-button-block' + ' ' + this.className + '-button-block' + '__' + themeColor}>
                {paymentButton}
            </div>);

        return (
            <div className={this.className + ' ' + this.className + '__simple' + ' ' + this.className + '__' + themeColor}>
                {blockButton}
                {spinner}
                {errorMessage}
            </div>
        );
    }
});

module.exports = SimpleView;

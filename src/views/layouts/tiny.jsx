var _ = require('lodash');
var React = require('react');
var SpinnerView = require('../spinner.jsx');
var ErrorMessageView = require('../error-message.jsx');
var PaymentButton = require('../payment-button.jsx');
var FormattedCurrency = require('../formatted-currency.jsx');
var TranslateMessage = require('../translate-message.jsx');
var TipsList = require('../tips-list.jsx');
var Logo = require('../logo.jsx');

var TinyView = React.createClass({
    className: 'xpay2Play-widget',
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
        var logoUrl = data.logoUrl;
        var errors = data.errors;
        var name = data.name;
        var paymentButtonColor = this.props.paymentButtonColor;
        var themeColor = this.props.themeColor;
        var allDrmLocked = data.drm
            ? data.drm.every((function (drm) { return drm.is_locked; }))
            : false;
        var logoModifiers = [themeColor];
        var amount = data.amount;
        var showPaymentButton = amount && (amount.value || amount.value === null); // if all drm is locked amount.value = null

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
                />
            );

        var tips = data.tips && (
                <TipsList baseClassName={this.className} tips={data.tips} onSelect={this.onTipSelect}
                          isTipsListOpened={this.state.isTipsListOpened}
                          themeColor={themeColor}
                />
            );

        var tipButtonContent = false;
        var selectedTips = null;
        var svgContent = false;

        if (this.state.selectedTipIndex >= 0 && this.state.selectedTipIndex < data.tips.length && !this.state.isTipsListOpened) {
            selectedTips = data.tips[this.state.selectedTipIndex];
            svgContent = false;

            tipButtonContent = (
                <span>
                    <span className={this.className + '-plus-icon'}>+</span>&thinsp;
                    <FormattedCurrency amount={selectedTips.amount}
                                       currency={selectedTips.currency}
                                       truncate={true}/>
                </span>
            );
            this.state.isThankShow = false;
        } else {
            if (this.state.isThankShow) {
                tipButtonContent = (<TranslateMessage message='thanks_tips'/>);

                svgContent = (<svg className={this.className + '-thank-icon'}
                                   xmlns="http://www.w3.org/2000/svg"
                                   width="12" height="12" viewBox="0 0 24 24">
                    <path
                        d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                </svg>);
            } else {
                tipButtonContent = (<TranslateMessage message='tip_the_developer'/>);

                svgContent = (<svg className={this.className + '-tip-icon'}
                                   xmlns="http://www.w3.org/2000/svg"
                                   width="12" height="12" viewBox="0 0 24 24">
                    <path
                        d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"/>
                </svg>);
            }
        }

        var tipButton = data.tips && (<div className={this.className + '-tip ' + ' ' +
            this.className + '-tip'  + '__' + themeColor + ' ' +
            (this.state.isTipsListOpened ? this.className + '-tip__moved ' : '') +
            ((this.state.isThankShow || this.state.isTipsListOpened) ? this.className + '-tip__disable' : '' )
            }><div className={this.className + '-tip-txt'}>
                <div className={this.className + '-tip-img ' + this.className + '-tip-img' + '__' + themeColor}>
                    {svgContent}
                </div>
                <div className={this.className + '-tip-button'}
                     onClick={this.onTipButtonClick}>
                    {tipButtonContent}
                </div>
            </div>
            </div>);

        var gameInfo = <div className={this.className + '-game-name ' +
            this.className + '-game-name' + '__' + themeColor + ' ' +
            (this.state.isTipsListOpened ? this.className + '-game-name__moved' : '')}>
            {name}
        </div>;

        var spinner = !isLoaded && (
                <SpinnerView />
            );

        var errorMessage = errors && (
                <ErrorMessageView errors={errors}/>
            );

        var gradientBlock = (
            <div
                className={this.className + '-gradient-block ' + this.className + '-gradient-block' + '__' + themeColor}>
            </div>
        );
        var blockButton = isLoaded && (<div className={this.className + '-button-block' + ' ' + this.className + '-button-block' + '__' + themeColor}>
                {gameInfo}
                {paymentButton}
                {gradientBlock}
                {!allDrmLocked && tipButton}
                {!allDrmLocked && tips}
            </div>);

        return (
            <div className={this.className + ' ' + this.className + '__tiny' + ' ' + this.className + '__' + themeColor}>
                {logoUrl && <Logo
                    url={ logoUrl }
                    container={ this.className }
                    modifiers={ logoModifiers } />}
                {blockButton}
                {spinner}
                {errorMessage}
            </div>
        );
    }
});

module.exports = TinyView;
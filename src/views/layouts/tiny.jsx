var _ = require('lodash');
var React = require('react');
var SpinnerView = require('../spinner.jsx');
var ErrorMessageView = require('../error-message.jsx');
var PaymentButton = require('../payment-button.jsx');
var FormattedCurrency = require('../formatted-currency.jsx');
var TranslateMessage = require('../translate-message.jsx');
var TipsList = require('../tips-list.jsx');

var TinyView = React.createClass({
    className: 'xpay2Play-widget',
    getInitialState: function () {
        return {
            isLoaded: false,
            logoUrl: null,
            errors: null,
            selectedTipIndex: -1,
            isTipsListOpened: false,
            isThankShow: false,
            paymentButtonColor : null,
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

        this.setState({isTipsListOpened: true});
    },

    componentWillReceiveProps: function (nextProps) {

        var newState = {};
        var data = nextProps.data || {};

        if (!_.isEmpty(data)) {
            newState.isLoaded = true;
        }

        if (data.logoUrl) {
            newState.logoUrl = data.logoUrl;
        }

        if (data.errors) {
            newState.errors = data.errors;
        }

        if (data.name) {
            newState.name = data.name;
        }

        if (nextProps.paymentButtonColor) {
            newState.paymentButtonColor = nextProps.paymentButtonColor;
        }

        this.setState(newState);
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
                        selectedTipIndex: index
                    }
                )
            }.bind(this), 500);
        } else {
            this.setState({
                isTipsListOpened: false,
                selectedTipIndex: index,
                isThankShow: false
            });
        }
    },

    render: function () {
        var logo = this.state.logoUrl && (
                <div
                    className={this.className + '-game-logo ' + (this.state.isTipsListOpened ? this.className + '-game-logo__moved' : '')}
                    style={{backgroundImage: 'url(' + this.state.logoUrl + ')'}}></div>
            );

        var paymentButton = this.props.data.amount && this.props.data.amount.value && (
                <PaymentButton amount={this.props.data.amount} baseClassName={this.className}
                               tips={this.props.data.tips}
                               selectedTipIndex={this.state.selectedTipIndex}
                               isTipsListOpened={this.state.isTipsListOpened}
                               paymentButtonColor={this.state.paymentButtonColor}
                               onPaymentOpen={this.onPaymentOpen}/>
            );

        var tips = this.props.data.tips && (
                <TipsList baseClassName={this.className} tips={this.props.data.tips} onSelect={this.onTipSelect} isTipsListOpened = {this.state.isTipsListOpened}/>
            );

        var tipButtonContent = false;
        var selectedTips = null;
        var svgContent = false;

        if (this.state.selectedTipIndex >= 0 && this.state.selectedTipIndex < this.props.data.tips.length) {
            selectedTips = this.props.data.tips[this.state.selectedTipIndex];
            svgContent = false;
            tipButtonContent = (<span>+&nbsp;<FormattedCurrency amount={selectedTips.amount}
                                                                currency={selectedTips.currency}
                                                                truncate={true}/></span>
            );
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

        var tipButton = this.props.data.tips && (<div className={this.className + '-tip ' + (this.state.isTipsListOpened ? this.className + '-tip__moved' : '')}>
                <div className={this.className + '-tip-img'}>
                    {svgContent}
                </div>
                <div className={this.className + '-tip-button'}
                     onClick={this.onTipButtonClick}>
                    {tipButtonContent}
                </div>
            </div>);

        var gameInfo = <div className={this.className + '-game-name ' + (this.state.isTipsListOpened ? this.className + '-game-name__moved' : '')}>
            {this.state.name}
        </div>;

        var spinner = !this.state.isLoaded && (
                <SpinnerView />
            );

        var errorMessage = this.state.errors && (
                <ErrorMessageView errors={this.state.errors}/>
            );

        var gradientBlock = (<div className={this.className + '-gradient-block'}>
            </div>
        );
        var blockButton = this.state.isLoaded && (<div className={this.className + '-button-block'}>
            {gameInfo}
            {paymentButton}
            {gradientBlock}
            {tipButton}
            {tips}
        </div>);

        return (
            <div className={this.className + ' ' + this.className + '__tiny'}>
                {logo}
                {blockButton}
                {spinner}
                {errorMessage}
            </div>
        );
    }
});
module.exports = TinyView;
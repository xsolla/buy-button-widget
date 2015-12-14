var _ = require('lodash');
var React = require('react');
var XsollaLogoView = require('../xsolla-logo.jsx');
var SpinnerView = require('../spinner.jsx');
var TranslateMessage = require('../translate-message.jsx');

var TinyView = React.createClass({
    className: 'xgamedelivery-widget',
    getInitialState: function() {
        return {
            isLoaded: false,
            gameLogoUrl: null,
            amount: {
                value: null,
                currency: null
            }
        };
    },
    componentWillReceiveProps(nextProps) {
        var newState = {};
        var data = nextProps.data || {};

        if (!_.isEmpty(data)) {
            newState.isLoaded = true;
        }

        if (data.gameLogoUrl) {
            newState.gameLogoUrl = data.gameLogoUrl;
        }

        if (data.amount) {
            newState.amount = {
                value: (data.amount || {}).value,
                currency: (data.amount || {}).currency
            }
        }

        this.setState(newState);
    },
    render: function () {
        var gameLogo = this.state.gameLogoUrl && (
            <div className={this.className + '-game-logo'} style={{backgroundImage: 'url(' + this.state.gameLogoUrl + ')'}}></div>
        );

        var paymentButton = this.state.amount.value && (
            <button className={this.className + '-payment-button'} onClick={this.props.onPaymentOpen.bind(this, {instance_id: null})}>
                <div className={this.className + '-payment-button-xsolla-logo'}>
                    <XsollaLogoView />
                </div>
                <div className={this.className + '-payment-button-amount'}>
                    <TranslateMessage message='payment_button_label' values={{amount: this.state.amount.value + ' ' + this.state.amount.currency}} />
                </div>
            </button>
        );

        var spinner = !this.state.isLoaded && (
            <SpinnerView />
        );

        return (
            <div className={this.className + ' ' + this.className + '__tiny'}>
                {gameLogo}
                {paymentButton}
                {spinner}
            </div>
        );
    }
});
module.exports = TinyView;

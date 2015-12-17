var _ = require('lodash');
var React = require('react');
var XsollaLogoView = require('../xsolla-logo.jsx');
var SpinnerView = require('../spinner.jsx');
var ErrorMessageView = require('../error-message.jsx');
var TranslateMessage = require('../translate-message.jsx');

var TinyView = React.createClass({
    className: 'xgamedelivery-widget',
    getInitialState: function() {
        return {
            isLoaded: false,
            logoUrl: null,
            amount: {
                value: null,
                currency: null
            },
            errors: null
        };
    },
    componentWillReceiveProps(nextProps) {
        var newState = {};
        var data = nextProps.data || {};

        if (!_.isEmpty(data)) {
            newState.isLoaded = true;
        }

        if (data.logoUrl) {
            newState.logoUrl = data.logoUrl;
        }

        if (data.amount) {
            newState.amount = {
                value: (data.amount || {}).value,
                currency: (data.amount || {}).currency
            }
        }

        if (data.errors) {
            newState.errors = data.errors;
        }

        this.setState(newState);
    },
    render: function () {
        var logo = this.state.logoUrl && (
            <div className={this.className + '-game-logo'} style={{backgroundImage: 'url(' + this.state.logoUrl + ')'}}></div>
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

        var errorMessage = this.state.errors && (
            <ErrorMessageView errors={this.state.errors} />
        );

        return (
            <div className={this.className + ' ' + this.className + '__tiny'}>
                {logo}
                {paymentButton}
                {spinner}
                {errorMessage}
            </div>
        );
    }
});
module.exports = TinyView;

var _ = require('lodash');
var React = require('react');
var SpinnerView = require('../spinner.jsx');
var ErrorMessageView = require('../error-message.jsx');
var PaymentButton = require('../payment-button.jsx');

var TinyView = React.createClass({
    className: 'xpay2Play-widget',
    getInitialState: function () {
        return {
            isLoaded: false,
            logoUrl: null,
            errors: null
        };
    },
    onPaymentOpen: function (options) {
        this.props.onPaymentOpen.call(this, options);
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

        this.setState(newState);
    },
    render: function () {
        var logo = this.state.logoUrl && (
                <div className={this.className + '-game-logo'}
                     style={{backgroundImage: 'url(' + this.state.logoUrl + ')'}}></div>
            );

        var paymentButton = this.props.data.amount && this.props.data.amount.value && (
                <PaymentButton amount={this.props.data.amount} baseClassName={this.className}
                               tips={this.props.data.tips}
                               onPaymentOpen={this.onPaymentOpen}/>
            );

        var spinner = !this.state.isLoaded && (
                <SpinnerView />
            );

        var errorMessage = this.state.errors && (
                <ErrorMessageView errors={this.state.errors}/>
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

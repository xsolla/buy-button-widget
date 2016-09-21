var React = require('react');
var XsollaLogoView = require('./xsolla-logo.jsx');
var TranslateMessage = require('./translate-message.jsx');
var FormattedCurrency = require('./formatted-currency.jsx');

var PaymentButton = React.createClass({
    getInitialState: function () {
        return {
            selectedTipIndex: -1,
            isTipsListOpened: false
        };
    },
    render: function () {
        var paymentMethodsCaption = (!this.props.amount || !this.props.amount.value) && (
                <div className={this.props.baseClassName + '-payment-button-methods'}>
                    <div className={this.props.baseClassName + '-payment-button-methods-count'}>
                        700+
                    </div>
                    <div className={this.props.baseClassName + '-payment-button-methods-label'}>
                        <TranslateMessage message='payment_button_methods_label'/>
                    </div>
                </div>
            );

        var price = this.props.amount && this.props.amount.value && (
                <div className={this.props.baseClassName + '-payment-button-amount'}>
                    <TranslateMessage
                        message={this.props.amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label'}
                        values={{
                            amount: <FormattedCurrency amount={this.props.amount.value}
                                                       currency={this.props.amount.currency}/>
                        }}/>
                </div>
            );

        return (
            <button className={this.props.baseClassName + '-payment-button'}
                    onClick={this.props.onPaymentOpen.bind(this, {instance_id: null})}>
                <div className={this.props.baseClassName + '-payment-button-xsolla-logo'}>
                    <XsollaLogoView />
                </div>
                {price}
                {paymentMethodsCaption}
            </button>
        );
    }
});
module.exports = PaymentButton;
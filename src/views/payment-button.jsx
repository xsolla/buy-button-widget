var _ = require('lodash');
var React = require('react');
var XsollaLogoView = require('./xsolla-logo.jsx');
var TranslateMessage = require('./translate-message.jsx');
var FormattedCurrency = require('./formatted-currency.jsx');
var TipsList = require('./tips-list.jsx');

var PaymentButton = React.createClass({
    onBtnClick: function (e) {
        var options = {
            instance_id: null,
            tips: null
        };

        if (this.props.selectedTipIndex >= 0) {
            options.tips = this.props.tips[this.props.selectedTipIndex];
        }

        if (!this.props.isThankShow) {
            this.props.onPaymentOpen.call(this, options, e);
        }

    },
    render: function () {
        var amount = this.props.amount;
        var baseClassName = this.props.baseClassName;
        var paymentButtonColor = this.props.paymentButtonColor;
        var isTipsListOpened = this.props.isTipsListOpened;
        var hasAmount = amount && amount.value;
        var hasDiscount = hasAmount && amount.value_without_discount && amount.value < amount.value_without_discount;

        var price = hasAmount && (
                <div className={baseClassName + '-payment-button-amount'}>
                    <TranslateMessage
                        message={amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label'}
                        values={{
                            amount: <FormattedCurrency amount={amount.value} currency={amount.currency}/>
                        }}/>
                </div>
            );

        var priceWithoutDiscount = hasDiscount && (
                <div className={baseClassName + '-payment-button-amount-without-discount ' +
                (paymentButtonColor ? baseClassName + '-payment-button-amount-without-discount__' + paymentButtonColor : '')}>
                    <FormattedCurrency amount={amount.value_without_discount} currency={amount.currency}/>
                </div>
            );

        var logo = (
            <div className={baseClassName + '-payment-button-xsolla-logo'}>
                <XsollaLogoView />
            </div>
        );

        return (
            <button className={baseClassName + '-payment-button ' +
            (isTipsListOpened ? baseClassName + '-payment-button__moved ' : '') +
            (paymentButtonColor ? baseClassName + '-payment-button__' + paymentButtonColor : '')}
                    onClick={this.onBtnClick}>
                {logo}
                {price}
                {priceWithoutDiscount}
            </button>
        );
    }
});
module.exports = PaymentButton;
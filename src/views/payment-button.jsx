var _ = require('lodash');
var React = require('react');
var TranslateMessage = require('./translate-message.jsx');
var FormattedCurrency = require('./formatted-currency.jsx');

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
        var releaseDate = Date.parse(this.props.releaseDate) || 0;
        var hasDiscount = amount.value_without_discount && amount.value < amount.value_without_discount;
        var buttonClassName = this.props.baseClassName + '-payment-button';
        var modifiers = [
            this.props.isTipsListOpened && 'moved',
            this.props.paymentButtonColor
        ];
        var buttonClassNameWithModifiers = buttonClassName + ' ' +
            modifiers
                .map(function (m) {
                    return m ? buttonClassName + '__' + m : '';
                })
                .join(' ');
        var isReleased = releaseDate < Date.now();
        var message;

        if (isReleased) {
            message = amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label';
        } else {
            message = 'payment_button_pre_purchase_label';
        }

        return (
            <button className={ buttonClassNameWithModifiers } onClick={ this.onBtnClick }>
                <span className={ buttonClassName + '-amount' }>
                    <TranslateMessage
                        message={ message }
                        values={{
                            amount: <FormattedCurrency amount={ amount.value } currency={ amount.currency }/>
                        }}/>
                    { hasDiscount && (
                        <FormattedCurrency
                            amount={ amount.value_without_discount }
                            currency={ amount.currency }
                            cls="discount"
                        />
                    ) }
                </span>
            </button>
        );
    }
});

module.exports = PaymentButton;
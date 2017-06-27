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
        var hasDiscount = amount.value_without_discount && amount.value < amount.value_without_discount;
        var buttonClassName = this.props.baseClassName + '-payment-button';
        var modifiers = [
            this.props.isTipsListOpened && 'moved',
            this.props.paymentButtonColor
        ];
        var isReleased = this.props.isReleased;
        var disabled = this.props.disabled;
        var message;

        if (isReleased) {
            message = amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label';
        } else {
            message = 'payment_button_pre_purchase_label';
        }

        if (disabled) {
            modifiers = [];
            message = 'payment_button_not_available_label';
        }

        var buttonClassNameWithModifiers = buttonClassName + ' ' + modifiers
                .map(function (m) { return m ? buttonClassName + '__' + m : ''; })
                .join(' ');

        return (
            <button
                className={ buttonClassNameWithModifiers }
                disabled={ disabled }
                onClick={ this.onBtnClick }>
                <span className={ buttonClassName + '-amount' }>
                    <TranslateMessage
                        message={ message }
                        values={ !disabled && {
                            amount: <FormattedCurrency amount={ amount.value } currency={ amount.currency }/>
                        } }/>
                    { !disabled && hasDiscount && (
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
var _ = require('lodash');
var React = require('react');
var XsollaLogoView = require('./xsolla-logo.jsx');
var TranslateMessage = require('./translate-message.jsx');
var FormattedCurrency = require('./formatted-currency.jsx');
var TipsList = require('./tips-list.jsx');

var PaymentButton = React.createClass({
    onBtnClick: function (e) {
        if (this.props.isTipsListOpened) {
            return;
        }

        var options = {
            instance_id: null,
            tips: null
        };

        if (this.props.selectedTipIndex >= 0) {
            options.tips = this.props.tips[this.props.selectedTipIndex];
        }

        this.props.onPaymentOpen.call(this, options, e);
    },
    render: function () {
        var hasAmount = this.props.amount && this.props.amount.value;

        var price = hasAmount && (
                <div className={this.props.baseClassName + '-payment-button-amount'}>
                    <TranslateMessage
                        message={this.props.amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label'}
                        values={{
                            amount: <FormattedCurrency amount={this.props.amount.value}
                                                       currency={this.props.amount.currency}/>
                        }}/>
                </div>
            );

        var logo = (<div className={this.props.baseClassName + '-payment-button-xsolla-logo'}>
                    <XsollaLogoView />
                </div>
            );

        return (
            <div className={this.props.baseClassName + '-payment-button ' +
            (this.props.isTipsListOpened ? this.props.baseClassName + '-payment-button__moved ' : '') +
            (this.props.paymentButtonColor ? this.props.baseClassName + '-payment-button__' + this.props.paymentButtonColor : '')}
                    onClick={this.onBtnClick}>
                {logo}
                {price}
            </div>
        );
    }
});
module.exports = PaymentButton;
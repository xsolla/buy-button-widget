var _ = require('lodash');
var React = require('react');
var XsollaLogoView = require('./xsolla-logo.jsx');
var TranslateMessage = require('./translate-message.jsx');
var FormattedCurrency = require('./formatted-currency.jsx');
var TipsList = require('./tips-list.jsx');

var PaymentButton = React.createClass({
    getInitialState: function () {
        return {
            selectedTipIndex: -1,
            isTipsListOpened: false,
        };
    },
    onTipButtonClick: function (e) {
        if (e && e.stopPropagation && e.preventDefault) {
            e.stopPropagation();
            e.preventDefault();
        }

        this.setState({isTipsListOpened: true});
    },
    onTipSelect: function (index) {
        if (!_.isFinite(index)) {
            index = -1;
        }

        this.setState({
            isTipsListOpened: false,
            selectedTipIndex: index
        });
    },
    onBtnClick: function (e) {
        if (this.state.isTipsListOpened) {
            return;
        }

        var options = {
            instance_id: null,
            tips: null
        };

        if (this.state.selectedTipIndex >= 0) {
            options.tips = this.props.tips[this.state.selectedTipIndex];
        }

        this.props.onPaymentOpen.call(this, options, e);
    },
    render: function () {
        var hasAmount = this.props.amount && this.props.amount.value;

        var paymentMethodsCaption = !hasAmount && (
                <div className={this.props.baseClassName + '-payment-button-methods'}>
                    <div className={this.props.baseClassName + '-payment-button-methods-count'}>
                        700+
                    </div>
                    <div className={this.props.baseClassName + '-payment-button-methods-label'}>
                        <TranslateMessage message='payment_button_methods_label'/>
                    </div>
                </div>
            );


        var price = hasAmount && !this.state.isTipsListOpened && (
                <div className={this.props.baseClassName + '-payment-button-amount'}>
                    <TranslateMessage
                        message={this.props.amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label'}
                        values={{
                            amount: <FormattedCurrency amount={this.props.amount.value}
                                                       currency={this.props.amount.currency}/>
                        }}/>
                </div>
            );

        var logo = !this.state.isTipsListOpened && (
                <div className={this.props.baseClassName + '-payment-button-xsolla-logo'}>
                    <XsollaLogoView />
                </div>
            );

        return (
            <div className={this.props.baseClassName + '-payment-button ' +
            (this.props.isTipsListOpened ? this.props.baseClassName + '-payment-button__moved ' : '') +
            (this.props.paymentButtonColor ? this.props.baseClassName + '-payment-button__' + this.props.paymentButtonColor : '')}
                    onClick={this.onBtnClick}>
                {logo}
                {paymentMethodsCaption}
                {price}
            </div>
        );
    }
});
module.exports = PaymentButton;
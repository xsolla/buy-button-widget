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
            isTipsListOpened: false
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
        var hasTips = _.isArray(this.props.tips) && !_.isEmpty(this.props.tips);

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

        var tipButtonContent = false;
        var selectedTips = null;
        if (hasTips && this.state.selectedTipIndex >= 0 && this.state.selectedTipIndex < this.props.tips.length) {
            selectedTips = this.props.tips[this.state.selectedTipIndex];
            tipButtonContent = (<span>+&nbsp;<FormattedCurrency amount={selectedTips.amount}
                                                                currency={selectedTips.currency}
                                                                truncateIntegers={true}/></span>
            );
        } else if (hasTips) {
            tipButtonContent = (<TranslateMessage message='add_tip'/>);
        }

        var tipButton = hasTips && !this.state.isTipsListOpened && (
                <a className={this.props.baseClassName + '-payment-button-tip-button'}
                   onClick={this.onTipButtonClick}>
                    {tipButtonContent}
                </a>
            );

        var price = hasAmount && !this.state.isTipsListOpened && (
                <div className={this.props.baseClassName + '-payment-button-amount'}>
                    <TranslateMessage
                        message={this.props.amount.hasDifferent ? 'payment_button_from_label' : 'payment_button_label'}
                        values={{
                            amount: <FormattedCurrency amount={this.props.amount.value}
                                                       currency={this.props.amount.currency}/>
                        }}/>
                    {tipButton}
                </div>
            );

        var logo = !this.state.isTipsListOpened && (
                <div className={this.props.baseClassName + '-payment-button-xsolla-logo'}>
                    <XsollaLogoView />
                </div>
            );

        var tipsList = this.state.isTipsListOpened && (
                <TipsList baseClassName={this.props.baseClassName} tips={this.props.tips} onSelect={this.onTipSelect}/>
            );

        return (
            <button className={this.props.baseClassName + '-payment-button'}
                    onClick={this.onBtnClick}>
                {logo}
                {paymentMethodsCaption}
                {price}
                {tipsList}
            </button>
        );
    }
});
module.exports = PaymentButton;
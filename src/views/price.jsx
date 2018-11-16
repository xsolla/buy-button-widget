var React = require('react');
var FormattedCurrency = require('./formatted-currency.jsx');

var Price = React.createClass({
    render: function() {
        var tagName = this.props.tagName && this.props.tagName !== undefined ? this.props.tagName : 'span';
        var amount = this.props.amount;
        var amountWithoutDiscount = this.props.amountWithoutDiscount;
        var hasDiscount = amountWithoutDiscount && amount < amountWithoutDiscount;
        var currency = this.props.currency;
        
        return React.createElement(
            tagName,
            {},
            <FormattedCurrency amount={ amount } currency={ currency } />,
            hasDiscount && <FormattedCurrency amount={ amountWithoutDiscount } currency={ currency } cls='discount' />
        )
    }
})

module.exports = Price;
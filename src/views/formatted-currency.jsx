var _ = require('lodash');
var React = require('react');
var rubleSVG = require('./images/ruble.svg');

var FormattedCurrencyView = React.createClass({
    render: function () {
        if (!this.props.amount) {
            return null;
        }

        var formattedAmount = parseFloat(this.props.amount).toFixed(2);
        var formattedCurrency = _.escape(this.props.currency);

        var rubleTemplate = '<span class="formatted-currency-ruble">' + rubleSVG + '</span>';
        var spaceTemplate = ' ';

        var template = [];

        switch (this.props.currency) {
            case null:
                template.push(formattedAmount);
                break;
            case 'USD':
                formattedCurrency = '$';
                template.push(formattedCurrency);
                template.push(formattedAmount);
                break;
            case 'EUR':
                formattedCurrency = '€';
                template.push(formattedCurrency);
                template.push(formattedAmount);
                break;
            case 'GBP':
                formattedCurrency = '£';
                template.push(formattedCurrency);
                template.push(formattedAmount);
                break;
            case 'BRL':
                formattedCurrency = 'R$';
                template.push(formattedCurrency);
                template.push(formattedAmount);
                break;
            case 'RUR':
            case 'RUB':
                template.push(formattedAmount);
                template.push(rubleTemplate);
                break;
            default:
                template.push(formattedAmount);
                template.push(spaceTemplate);
                template.push(formattedCurrency);
        }

        var formattedValue = template.join('');
        return <span className="formatted-currency" dangerouslySetInnerHTML={{__html: formattedValue}}></span>;
    }
});
module.exports = FormattedCurrencyView;

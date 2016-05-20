var _ = require('lodash');
var React = require('react');
var rubleSVG = require('./images/ruble.svg');
var currencyFormat = require('currency-format.json');

var FormattedCurrencyView = React.createClass({
    render: function () {
        if (!this.props.amount) {
            return null;
        }

        var formattedAmount = Math.abs(parseFloat(this.props.amount));
        var signAmount = parseFloat(this.props.amount) < 0 ? '-' : '';
        var formattedCurrency = _.escape(this.props.currency);

        var rubleTemplate = '<span class="formatted-currency-ruble">' + rubleSVG + '</span>';
        var spaceTemplate = ' ';

        var template = [];

        template.push(signAmount);

        switch (this.props.currency) {
            case null:
                formattedAmount = formattedAmount.toFixed(2);
                template.push(formattedAmount);
                break;
            case 'RUR':
            case 'RUB':
                formattedAmount = formattedAmount.toFixed(2);
                template.push(formattedAmount);
                template.push(rubleTemplate);
                break;
            default:
                var uniqSymbol = !!currencyFormat[this.props.currency.toUpperCase()].uniqSymbol ? currencyFormat[this.props.currency.toUpperCase()].uniqSymbol : null;

                if (uniqSymbol && !!uniqSymbol.grapheme && !!uniqSymbol.template && !uniqSymbol.rtl) {
                    formattedAmount = formattedAmount.toFixed(currencyFormat[this.props.currency.toUpperCase()].fractionSize);
                    formattedCurrency = uniqSymbol.grapheme;
                    _.forEach(uniqSymbol.template, function(char) {
                        switch (char) {
                            case '$':
                                template.push(formattedCurrency);
                                break;
                            case '1':
                                template.push(formattedAmount);
                                break;
                            case ' ':
                                template.push(spaceTemplate);
                                break;
                        }
                    });
                } else {
                    template.push(formattedAmount);
                    if (!_.isUndefined(formattedAmount) && !_.isUndefined(formattedCurrency)) {
                        template.push(spaceTemplate);
                    }
                    template.push(formattedCurrency);
                }
        }

        var formattedValue = template.join('');
        return <span className="formatted-currency" dangerouslySetInnerHTML={{__html: formattedValue}}></span>;
    }
});
module.exports = FormattedCurrencyView;

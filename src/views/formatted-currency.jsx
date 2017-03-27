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
        var discount = this.props.discount;
        var cls = this.props.cls || '';

        var rubleTemplate = '<span class="formatted-currency-ruble">' + rubleSVG + '</span>';
        var spaceTemplate = ' ';

        var truncate = this.props.truncate;

        var fractionSize;
        if (truncate && formattedAmount % 1 === 0) {
            fractionSize = 0;
        } else if (truncate && formattedAmount * 10 % 1 === 0) {
            fractionSize = 1;
        } else if (this.props.currency) {
            fractionSize = currencyFormat[this.props.currency.toUpperCase()].fractionSize;
        } else {
            fractionSize = 2;
        }

        var template = [];
        template.push(signAmount);

        switch (this.props.currency) {
            case null:
                formattedAmount = formattedAmount.toFixed(fractionSize).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                template.push(formattedAmount);
                break;
            case 'RUR':
            case 'RUB':
                formattedAmount = formattedAmount.toFixed(fractionSize).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                template.push(formattedAmount);
                template.push(rubleTemplate);
                break;
            default:
                var uniqSymbol = !!currencyFormat[this.props.currency.toUpperCase()].uniqSymbol ? currencyFormat[this.props.currency.toUpperCase()].uniqSymbol : null;

                if (uniqSymbol && !!uniqSymbol.grapheme && !!uniqSymbol.template && !uniqSymbol.rtl) {
                    formattedAmount = formattedAmount.toFixed(fractionSize).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    formattedCurrency = uniqSymbol.grapheme;
                    _.forEach(uniqSymbol.template, function (char) {
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
        return <span className={ 'formatted-currency ' + cls } dangerouslySetInnerHTML={{__html: formattedValue}}></span>;
    }
});
module.exports = FormattedCurrencyView;

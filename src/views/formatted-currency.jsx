var React = require('react');
var CreateReactClass = require('create-react-class');
var currencyFormat = require('currency-format.json');
var currencyNumberFormat = require('currency-number-format.json');

// CURRENCY CODE
function defaultCurrency(currency) {
    return {
        'name': currency,
        'fractionSize': 2,
        'symbol': {
            'grapheme': currency,
            'template': null,
            'rtl': false
        },
        'uniqSymbol': null
    };
}
function getCurrencyOptions(currency) {
    return currency
        ? currencyFormat[currency.toUpperCase()] || defaultCurrency(currency)
        : defaultCurrency(currency);
}

// LOCALE
var defaultLocale = 'en_US';
var localesMap = {
    'ar': 'ar_AE',
    'bg': 'bg_BG',
    'cn': 'zh_CN',
    'cs': 'cs_CZ',
    'de': 'de_DE',
    'en': 'en_US',
    'es': 'es_ES',
    'fr': 'fr_FR',
    'he': 'he_IL',
    'it': 'it_IT',
    'ja': 'ja_JP',
    'ko': 'ko_KR',
    'pl': 'pl_PL',
    'pt': 'pt_BR',
    'ro': 'ro_RO',
    'ru': 'ru_RU',
    'th': 'th_TH',
    'tr': 'tr_TR',
    'tw': 'zh_TW',
    'vi': 'vi_VN'
};
function formatLocale(locale) {
    return [locale.substr(0, 2).toLowerCase(), locale.substr(3, 2).toUpperCase()].join('_');
}
function getLanguageOptions(locale) {
    return locale
        ? currencyNumberFormat[formatLocale(locale)] || currencyNumberFormat[defaultLocale]
        : currencyNumberFormat[defaultLocale];
}
function map2to5Locale(locale) {
    return locale && locale.length === 5
        ? locale
        : localesMap[locale] || defaultLocale;
}

// CURRENCY
function getFormattedCurrency(amount, currency, locale) {
    var parsedAmount = parseFloat(amount);
    if (!currency || isNaN(parsedAmount)) {
        return {
            formattedCurrency: amount + ' ' + currency,
            dir: 'ltr'
        };
    }

    var currencyOptions = getCurrencyOptions(currency);
    var languageOptions = getLanguageOptions(locale);

    var signAmount = parsedAmount < 0 ? '-' : '';
    var fractionSize = currencyOptions.fractionSize;

    var symbol = currencyOptions.symbol;
    var thousandSeparator = languageOptions.thousands;
    var decimalSeparator = languageOptions.decimal;
    // Spike for escaping case when grapheme is arabic symbol, and russian style separators was chosen
    if ((!symbol || symbol.rtl) && languageOptions.thousands === ' ') {
        thousandSeparator = ',';
        decimalSeparator = '.';
    }

    var splittedAmount = Math.abs(parsedAmount)
        .toFixed(fractionSize)
        .split('.');
    splittedAmount[0] = splittedAmount[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
    var formattedAmount = splittedAmount.join(decimalSeparator);

    var formattedCurrency = signAmount + formattedAmount + ' ' + currency;
    var rtl = false;
    if (symbol && symbol.template) {
        formattedCurrency = signAmount + symbol.template
            .replace('1', formattedAmount)
            .replace('$', symbol.grapheme);
        rtl = symbol.rtl;
    }

    return {
        formattedCurrency: formattedCurrency,
        dir: rtl ? 'rtl' : 'ltr'
    };
}

var FormattedCurrencyView = CreateReactClass({
    render: function () {
        if (!this.props.amount) {
            return null;
        }

        var formattedCurrency = getFormattedCurrency(this.props.amount, this.props.currency, map2to5Locale(this.props.locale));

        if (!formattedCurrency) {
            return;
        }
        var cls = this.props.cls || '';
        return <span className={ 'formatted-currency ' + cls } dir={formattedCurrency.dir}>{formattedCurrency.formattedCurrency}</span>;
    }
});

module.exports = FormattedCurrencyView;

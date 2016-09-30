var _ = require('lodash');
var React = require('react');
var FormattedCurrency = require('./formatted-currency.jsx');

var TipsList = React.createClass({
    onTipItemClick: function (index, e) {
        e.stopPropagation();
        e.preventDefault();

        this.props.onSelect.call(this, index);
    },
    render: function () {
        var self = this;

        return (
            <ul className={this.props.baseClassName + '-tips-list'}>
                <li key={-1} onClick={this.onTipItemClick.bind(this, -1)}
                    className={this.props.baseClassName + '-tips-list-item ' + this.props.baseClassName + '-tips-list-item__close'}>
                    <a className={this.props.baseClassName + '-tips-list-item-link'}>
                        <svg
                            className={this.props.baseClassName + '-tips-list-item-icon'}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" viewBox="0 0 24 24">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </a>
                </li>
                {
                    _.map(this.props.tips, function (tip, index) {
                        return (
                            <li key={index} onClick={self.onTipItemClick.bind(self, index)}
                                className={self.props.baseClassName + '-tips-list-item ' + self.props.baseClassName + '-tips-list-item__amount'}>
                                <a>
                                    <FormattedCurrency amount={tip.amount}
                                                       currency={tip.currency}
                                                       truncate={true}/>
                                </a>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
});
module.exports = TipsList;
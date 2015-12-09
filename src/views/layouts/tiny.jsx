var React = require('react');
var XsollaLogoView = require('../xsolla-logo.jsx');

var TinyView = React.createClass({
    className: 'xgamedelivery-widget',
    getInitialState: function() {
        return {
            gameLogoUrl: 'https://livedemo.xsolla.com/screenshots/war-for-the-overworld.png',
            amount: {
                value: 29.99,
                currency: 'USD'
            }
        };
    },
    render: function () {
        return (
            <div className={this.className + ' ' + this.className + '__tiny'}>
                <div className={this.className + '-game-logo'} style={this.state.gameLogoUrl ? {backgroundImage: 'url(' + this.state.gameLogoUrl + ')'} : null}>
                </div>
                <button className={this.className + '-payment-button'} onClick={this.handleClick}>
                    <div className={this.className + '-payment-button-xsolla-logo'}>
                        <XsollaLogoView />
                    </div>
                    <div className={this.className + '-payment-button-amount'}>
                        Pay {this.state.amount.value} {this.state.amount.currency}
                    </div>
                </button>
            </div>
        );
    },
    handleClick: function () {
        
    }
});
module.exports = TinyView;

var _ = require('lodash');
var React = require('react');
var checkRetina = require('is-retina-js');
var XsollaLogoView = require('../xsolla-logo.jsx');
var SpinnerView = require('../spinner.jsx');
var ErrorMessageView = require('../error-message.jsx');
var TranslateMessage = require('../translate-message.jsx');
var gearSVG = require('../images/gear.svg');
var TetherTarget = require('../tether/TetherTarget.jsx');
var FormattedCurrency = require('../formatted-currency.jsx');

var FullView = React.createClass({
    className: 'xgamedelivery-widget',
    getInitialState: function() {
        return {
            isLoaded: false,
            logoUrl: null,
            paymentList: null,
            name: null,
            description: null,
            systemRequirements: null,
            drm: null,
            amount: {
                value: null,
                currency: null,
                hasDifferent: false
            },
            errors: null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        var newState = {};
        var data = nextProps.data || {};

        if (!_.isEmpty(data)) {
            newState.isLoaded = true;
        }

        if (data.paymentList) {
            newState.paymentList = data.paymentList;
        }

        if (data.logoUrl) {
            newState.logoUrl = data.logoUrl;
        }

        if (data.name) {
            newState.name = data.name;
        }

        if (data.description) {
            newState.description = data.description;
        }

        if (data.systemRequirements) {
            newState.systemRequirements = data.systemRequirements;
        }

        if (data.drm) {
            newState.drm = data.drm;
        }

        if (data.amount) {
            newState.amount = {
                value: (data.amount || {}).value,
                currency: (data.amount || {}).currency,
                hasDifferent: (data.amount || {}).hasDifferent
            }
        }

        if (data.errors) {
            newState.errors = data.errors;
        }

        this.setState(newState);
    },
    render: function () {
        var logo = this.state.logoUrl && (
            <div className={this.className + '-game-logo'} style={{backgroundImage: 'url(' + this.state.logoUrl + ')'}}></div>
        );

        var drmList;
        var drm = this.state.drm || [];

        var drmTetherOptions = {
            // element and target are set automatically
            attachment: 'bottom center',
            targetAttachment: 'top center'
        };

        if (drm.length === 1) {
            drmList = _.first(drm).platforms.map(function (item, key) {
                return (
                    <TetherTarget className={this.className + '-game-drm-item'}
                                  tethered={item.name}
                                  tetherOptions={drmTetherOptions}
                                  toggleOnMouse={true}
                                  key={item.code + '_' + key}>
                        <img alt={item.name} src={item.image_src} />
                    </TetherTarget>
                );
            }, this)
        } else if (drm.length > 1) {
            drmList = drm.map(function (item, key) {
                var platformLabels = !_.isEmpty(item.platforms) ? _.pluck(item.platforms, 'name').join(', ') : item.name;
                return (
                    <TetherTarget className={this.className + '-game-drm-item'}
                                  tethered={platformLabels}
                                  tetherOptions={drmTetherOptions}
                                  toggleOnMouse={true}
                                  key={item.sku + '_' + key}>
                        <img alt={platformLabels} src={item.image_src} />
                    </TetherTarget>
                );
            }, this)
        }

        var gearIcon = (
            <span dangerouslySetInnerHTML={{__html: gearSVG}}></span>
        );

        var price = (
            <FormattedCurrency amount={this.state.amount.value} currency={this.state.amount.currency} />
        );
        if (this.state.amount.hasDifferent) {
            price = (
                <TranslateMessage message='payment_button_from_label' values={{amount: price}} />
            );
        }

        var systemRequirementsTetherOptions = {
            // element and target are set automatically
            attachment: 'bottom right',
            targetAttachment: 'top right'
        };

        var gameInfo = this.state.isLoaded && !this.state.errors && (
            <div className={this.className + '-game'}>
                <div className={this.className + '-game-logo-column'}>
                    {logo}
                </div>
                <div className={this.className + '-game-info-column'}>
                    <div className={this.className + '-game-price'}>
                        {price}
                    </div>
                    <div className={this.className + '-game-name'}>
                        {this.state.name}
                    </div>
                    <div className={this.className + '-game-description'}>
                        {this.state.description}
                    </div>
                    <div className={this.className + '-game-system-requirements'}>
                        <i className={this.className + '-game-system-requirements-icon'}>
                            {gearIcon}
                        </i>
                        <TetherTarget className={this.className + '-game-system-requirements-label'}
                                      tethered={<pre>{this.state.systemRequirements}</pre>}
                                      tetherOptions={systemRequirementsTetherOptions}
                                      toggleOnClick={true}>
                            <TranslateMessage message='system_requirements_label'/>
                        </TetherTarget>
                    </div>
                    <div className={this.className + '-game-drm'}>
                        {drmList}
                    </div>
                </div>
            </div>
        );

        var isRetina = checkRetina();
        var paymentList = this.state.paymentList && (
            <div className={this.className + '-payment-list'}>
                <div className={this.className + '-payment-list-title'}>
                    <TranslateMessage message='payment_list_title' />
                </div>
                {_.slice(this.state.paymentList, 0, 5).map(function (instance) {
                    return (
                        <a key={instance.id} className={this.className + '-payment-list-method'} onClick={this.props.onPaymentOpen.bind(this, {instance_id: instance.id})}>
                            <div className={this.className + '-payment-list-method-image'} style={{backgroundImage: 'url(' + (isRetina ? instance.imgRetinaUrl : instance.imgUrl) + ')'}}></div>
                        </a>
                    );
                }, this)}
            </div>
        );

        var paymentButton = this.state.amount.value && (
            <button className={this.className + '-payment-button'} onClick={this.props.onPaymentOpen.bind(this, {instance_id: null})}>
                <div className={this.className + '-payment-button-xsolla-logo'}>
                    <XsollaLogoView />
                </div>
                <div className={this.className + '-payment-button-methods'}>
                    <div className={this.className + '-payment-button-methods-count'}>
                        700+
                    </div>
                    <div className={this.className + '-payment-button-methods-label'}>
                        <TranslateMessage message='payment_button_methods_label' />
                    </div>
                </div>
            </button>
        );

        var paymentInfo = this.state.isLoaded && !this.state.errors && (
            <div className={this.className + '-payment'}>
                {paymentList}
                {paymentButton}
            </div>
        );

        var spinner = !this.state.isLoaded && (
            <SpinnerView />
        );

        var errorMessage = this.state.errors && (
            <ErrorMessageView errors={this.state.errors} />
        );

        return (
            <div className={this.className + ' ' + this.className + '__full'}>
                {gameInfo}
                {paymentInfo}
                {spinner}
                {errorMessage}
            </div>
        );
    }
});
module.exports = FullView;

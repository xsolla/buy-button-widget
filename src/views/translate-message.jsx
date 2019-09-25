var _ = require('lodash');
var React = require('react');
var CreateReactClass = require('create-react-class');
var ReactDOMServer = require('react-dom-server');
var Translate = require('../translate.js');

var TranslateMessage = CreateReactClass({
    render: function () {
        var values = this.props.values;
        _.each(values, function (value, index) {
            if (React.isValidElement(value)) {
                values[index] = ReactDOMServer.renderToStaticMarkup(value);
            }
        });

        if (this.props.doubleSpan) {
            return <span>
                       <span className={ 'translate-message' }
                          dangerouslySetInnerHTML={{__html: Translate.translate(this.props.message, {amount: ''})}}/>
                       <span className={ 'translate-message-amount' } dangerouslySetInnerHTML={{__html: values.amount}}/>
                   </span>
        } else {
            return <span className={ 'translate-message' }
                         dangerouslySetInnerHTML={{__html: Translate.translate(this.props.message, values)}}/>;
        }
    }
});
module.exports = TranslateMessage;

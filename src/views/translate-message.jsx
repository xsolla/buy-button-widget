var React = require('react');
var CreateReactClass = require('create-react-class');
var ReactDOMServer = require('react-dom-server');
var Translate = require('../translate.js');

var TranslateMessage = CreateReactClass({
  render: function () {
      var values = this.props.values;
      var message = this.props.message;
      var doubleSpan = this.props.doubleSpan;

      var translateContent = (values && Object.keys(values)
          .filter(function(key) { return React.isValidElement(values[key]) })
          .reduce(function(acc, curr) {
              acc[curr] = ReactDOMServer.renderToStaticMarkup(values[curr]);
              return acc;
          }, {})) || [];

      if (doubleSpan) {
          return <span>
                      <span className={ 'translate-message' }
                        dangerouslySetInnerHTML={{__html: Translate.translate(message, {amount: ''})}}/>
                      <span
                          className={ 'translate-message-amount' }
                          dangerouslySetInnerHTML={{__html: translateContent.amount}}
                      />
                  </span>
      } else {
          return <span className={ 'translate-message' }
                        dangerouslySetInnerHTML={{__html: Translate.translate(message, translateContent)}}/>;
      }
  }
});
module.exports = TranslateMessage;

var React = require('react');
var CreateReactClass = require('create-react-class');
var ReactDOMServer = require('react-dom-server');
var Translate = require('../translate.js');

var TranslateMessage = CreateReactClass({
  render: function () {
      const { values, message, doubleSpan } = this.props;

      const translateContent = (values && Object.keys(values)
          .filter(key => React.isValidElement(values[key]))
          .reduce((acc, curr) => {
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

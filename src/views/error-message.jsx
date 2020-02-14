const React = require('react');
const CreateReactClass = require('create-react-class');
const errorSVG = require('./images/error.svg');

const DEFAULT_ERROR_CODE = 1000;

const ErrorMessageView = CreateReactClass({
    render: function () {
        const {errorCode} = (this.props.errors || [{errorCode: DEFAULT_ERROR_CODE}])[0];

        return (
            <span className="error-message">
                <div dangerouslySetInnerHTML={{__html: errorSVG}}/>
                <div>Error</div>
                <div>{errorCode ? '(' + errorCode + ')' : ''}</div>
            </span>
        );
    }
});
module.exports = ErrorMessageView;

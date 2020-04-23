const React = require('react');
const CreateReactClass = require('create-react-class');
const errorSVG = require('./images/error.svg');

const DEFAULT_DISPLAY_ERROR_CODE = '0401-1000';
const ERROR_CODE_REGEX = /[\d]{4}-[\d]{4}/gi;

const ErrorMessageView = CreateReactClass({
    render: function () {
        let displayErrorCode = DEFAULT_DISPLAY_ERROR_CODE;

        const {error} = this.props;
        if (error.errorMessage) {
            displayErrorCode = error.errorMessage.match(ERROR_CODE_REGEX);
        }

        return (
            <span className="error-message">
                <div dangerouslySetInnerHTML={{__html: errorSVG}}/>
                <div>Error</div>
                <div>{displayErrorCode ? `(${displayErrorCode})` : ''}</div>
            </span>
        );
    }
});
module.exports = ErrorMessageView;

var React = require('react');

function Logo(props) {
    var container = props.container;
    var modifiers = props.modifiers;
    var url = props.url;
    var baseClassName = container + '-game-logo';
    var classNameWithModifiers = [baseClassName].concat(
            modifiers.map(function (m) { return baseClassName + '__' + m; })
        ).join(' ');

    return (
        <div
            className={ classNameWithModifiers }
            style={{backgroundImage: 'url(' + url + ')'}}>
        </div>
    );
}

module.exports = Logo;
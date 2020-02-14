function isEmpty(value) {
    return value === null || value === undefined;
}

function zipObject(props, values) {
    let index = -1,
        length = props ? props.length : 0,
        result = {};

    if (length && !values && !Array.isArray(props[0])) {
        values = [];
    }
    while (++index < length) {
        const key = props[index];
        if (values) {
            result[key] = values[index];
        } else if (key) {
            result[key[0]] = key[1];
        }
    }
    return result;
}

function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
}

function filterObject(object) {
    Object.keys(object).forEach(key => !Boolean(object[key]) && delete object[key]);
}

function buildQueryString(data) {
    return Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
}

function removeParamFromUrl(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(paramName);

    const url = document.location.origin
        + document.location.pathname
        + '?' + urlParams.toString()
        + document.location.hash;
    window.history.pushState({}, document.title, url);
}

module.exports = {
    isEmpty,
    zipObject,
    deepClone,
    filterObject,
    buildQueryString,
    removeParamFromUrl
};

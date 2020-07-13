module.exports = function (message) {
    this.message = message;
    this.name = "XsollaBuyButtonWidgetException";
    this.toString = (function () {
        return this.name + ': ' + this.message;
    }).bind(this)
};

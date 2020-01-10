module.exports = function (message) {
    this.message = message;
    this.name = "XsollaPay2PlayWidgetException";
    this.toString = (function () {
        return this.name + ': ' + this.message;
    }).bind(this)
};

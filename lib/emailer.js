var Emailer;

Emailer = (function() {
    Emailer.prototype.options = {};


    function Emailer(options) {
        this.options = options;
    }

    Emailer.prototype.sendEmail = function() {
        return this.options.message;
    };

    return Emailer;

})();

module.exports = Emailer;

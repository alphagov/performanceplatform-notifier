var expect = require("chai").expect;
var Emailer = require("../lib/emailer.js");

describe("Emailer", function(){
    describe("#sendEmail()", function(){
        it("should send a hello world to nowhere", function(){
            var emailer = new Emailer({
                message: "hello world"
            });
            var results = emailer.sendEmail();

            expect(results).to.equal("hello world");

        });
    });
});

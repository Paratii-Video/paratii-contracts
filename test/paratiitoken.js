var ParatiiToken = artifacts.require("./ParatiiToken.sol");

contract('ParatiiToken', function(accounts) {
    it("test basic sanity", async function() {
        let value;
        let token = await ParatiiToken.new();
        let balance = await token.balanceOf(accounts[0]);
        // we expect the initial balanace of the owner to be 21M * 18 point precision
        assert.equal(balance.valueOf(), 21000000 * Math.pow(10,18));

        // 
         
    });
});
 
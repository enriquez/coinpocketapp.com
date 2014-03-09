describe("BlockHeight", function() {
  var blockHeight = CoinPocketApp.Models.blockHeight;

  describe("#height", function() {

    it("fetches the current block height", function(done) {
      blockHeight.fetchHeight(function(height) {
        expect(height).toEqual(289645);
        done();
      });
    });

  });

});

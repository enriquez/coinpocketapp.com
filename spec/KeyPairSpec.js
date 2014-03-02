describe("CoinPocketApp.Models.KeyPair", function() {

  var password = "lamepassword"

  describe(".keyPair", function() {

    it("is initially undefined", function() {
      expect(CoinPocketApp.Models.KeyPair.hasKeyPair()).toBe(false);
      expect(CoinPocketApp.Models.KeyPair.keyPair).toBeUndefined;
    });

  });

  describe(".generate", function() {

    beforeEach(function(done) {
      CoinPocketApp.Models.KeyPair.generate(password, function(keyPair) {
        done();
      });
    });

    it("creates a keyPair", function() {
      expect(CoinPocketApp.Models.KeyPair.hasKeyPair()).toBe(true);
      expect(CoinPocketApp.Models.KeyPair.keyPair).toBeDefined;
    });

    it("encrypts the private key exponent", function() {
      var encryptedData = JSON.parse(CoinPocketApp.Models.KeyPair.keyPair.encryptedPrivateKeyExponent);
      expect(encryptedData.mode).toEqual("ccm");
      expect(encryptedData.cipher).toEqual("aes");
    });

  });

});

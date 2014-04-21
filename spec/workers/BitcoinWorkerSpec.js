describe("Bitcoin Worker", function() {

  describe("messageListener", function() {
    self.myFunction = function(param, hollaback) {
      hollaback('hello');
    };
    var e = {
      data: {
        id: 1,
        functionName: "myFunction",
        params: JSON.stringify(["myParam"])
      }
    };

    beforeEach(function() {
      spyOn(self, 'postMessage');
      messageListener(e);
    });

    it("executes a function and posts the result", function() {
      expect(self.postMessage).toHaveBeenCalledWith({
        id: 1,
        result: 'hello'
      });
    });

  });

  describe("seedGenerateAndEncryptKeys", function() {
    var keyPair;

    beforeEach(function(done) {
      var seed = [-1474891504, -1552178016, -359647072, -1630770783, -162958535, -1029536245, -666931929, -657979881, -125480220, 1722003663, 609192885, 1218046294, 852556491, -1396030597, 1698027613, 1170441188, 846273812, 2081125000, -23919877, 111969445, 1697805762, -1775882179, -1618683970, 932527123, -1682285695, 1694611839, 975367731, -698701612, -1511733887, 378313008, -1731979695, 1973490238];
      seedGenerateAndEncryptKeys(seed, "lamepassword", function(result) {
        keyPair = result;
        done();
      });
    });

    it("encrypts and signs the private key exponent", function() {
      var encryptedData = JSON.parse(keyPair.encryptedPrivateKeyExponent);
      expect(encryptedData.mode).toEqual("ccm");
      expect(encryptedData.cipher).toEqual("aes");
    });

    it("decrypts the private key exponent to 32 bytes", function() {
      var privateKeyExponent = sjcl.json.decrypt("lamepassword", keyPair.encryptedPrivateKeyExponent);
      expect(privateKeyExponent).toMatch(/^[a-fA-F0-9]{64}$/);
    });

    it("fails to decrypt with the wrong password", function() {
      expect(function() {
        var privateKeyExponent = sjcl.json.decrypt("wrong", keyPair.encryptedPrivateKeyExponent);
      }).toThrow();
    });

    it("generates a valid bitcoin address", function() {
      expect(Bitcoin.Address.validate(keyPair.bitcoinAddress)).toBe(true);
    });

    it("generates two 32 byte public key coordinates", function() {
      expect(keyPair.publicKeyX).toMatch(/^[a-fA-F0-9]{64}$/);
      expect(keyPair.publicKeyY).toMatch(/^[a-fA-F0-9]{64}$/);
    });

  });

});

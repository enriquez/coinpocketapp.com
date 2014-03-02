describe("Bitcoin", function() {

  beforeEach(function() {
    Bitcoin.Entropy.paranoia = 0;
  });

  describe("Address", function() {

    describe(".validate", function() {

      it("returns true given 1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T", function() {
        expect(Bitcoin.Address.validate("1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T")).
          toBe(true);
      });

      it("returns false with an invalid checksum", function() {
        expect(Bitcoin.Address.validate("1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1a")).
          toBe(false);
      });

      it("returns true given 1Drt3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew", function() {
        expect(Bitcoin.Address.validate("1Drt3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew")).
          toBe(true);
      });

      it("returns false with an invalid checksum", function() {
        expect(Bitcoin.Address.validate("1Ert3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew")).
          toBe(false);
      });

      it("returns false when it doesn't start with a 1", function() {
        expect(Bitcoin.Address.validate("mjHGK31NyLGkjkFYRYMngkrP2FjSQzmDaD")).
          toBe(false);
      });

      it("returns false when it is too short", function() {
        expect(Bitcoin.Address.validate("1NotAnAddress")).
          toBe(false);
      });

      it("returns false when containing an O", function() {
        expect(Bitcoin.Address.validate("1Ort3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew")).
          toBe(false);
      });

      it("returns false when containing an I", function() {
        expect(Bitcoin.Address.validate("1Irt3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew")).
          toBe(false);
      });

      it("returns false when containing an l", function() {
        expect(Bitcoin.Address.validate("1lrt3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew")).
          toBe(false);
      });

      it("returns false when containing an 0", function() {
        expect(Bitcoin.Address.validate("10rt3c8pSdrkyjuBiwVcSSixZwQtMZ3Tew")).
          toBe(false);
      });

      it("returns false when not base58 encoded", function() {
        expect(Bitcoin.Address.validate("1*wSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T")).
          toBe(false);
      });

    });

    describe(".generate", function() {

      var keyPair;

      beforeEach(function(done) {
        Bitcoin.Address.generate(function(obj) {
          keyPair = obj;
          done();
        });
      });

      it("generates a valid Bitcoin address", function() {
        expect(Bitcoin.Address.validate(keyPair.bitcoinAddress)).toBe(true);
      });

      it("uses the secp256k1 curve", function() {
        expect(keyPair.curve === sjcl.ecc.curves.k256).toBe(true);
      });

      it("generates a private key exponent", function() {
        expect(keyPair.privateKeyExponent).toBeDefined;
      });

      it("generates a public key", function() {
        expect(keyPair.publicKeyX).toBeDefined;
        expect(keyPair.publicKeyY).toBeDefined;
      });

    });

  });

});

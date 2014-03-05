describe("Bitcoin", function() {

  beforeEach(function() {
    Bitcoin.paranoia = 0;
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

  describe(".parseCode", function() {

    it("parses a bitcoin address", function() {
      var actual = Bitcoin.parseCode('1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T');

      expect(actual).toEqual({
        address : '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T'
      });
    });

    it("parses a bitcoin address with the bitcoin: prefix", function() {
      var actual = Bitcoin.parseCode('bitcoin:1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T');

      expect(actual).toEqual({
        address : '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T'
      });
    });

    it("parses an address and amount", function() {
      var actual = Bitcoin.parseCode('bitcoin:1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T?amount=0.0001');

      expect(actual).toEqual({
        address : '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T',
        amount : 0.0001
      });
    });

    it("parses an address and label", function() {
      var actual = Bitcoin.parseCode('bitcoin:1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T?label=Mike');

      expect(actual).toEqual({
        address : '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T',
        label : 'Mike'
      });
    });

    it("parses an address, amount, and label", function() {
      var actual = Bitcoin.parseCode('bitcoin:1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T?amount=10.23&label=Mike');

      expect(actual).toEqual({
        address : '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T',
        amount : 10.23,
        label : 'Mike'
      });
    });

    it("parses params while url decoding", function() {
      var actual = Bitcoin.parseCode('bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?amount=50&label=Luke-Jr&message=Donation%20for%20project%20xyz');

      expect(actual).toEqual({
        address : '175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W',
        amount : 50,
        label : 'Luke-Jr',
        message : 'Donation for project xyz'
      });
    });

    it("parses a bitpay qrcode", function() {
      var actual = Bitcoin.parseCode('bitcoin:1ADei3yngtnFhqJRuKEp2YdNqritUi8icD?amount=0.0736&r=https%3A%2F%2Fbitpay.com%2Fi%2F8S37XGmf5MeXUbuvuHcQUk');

      expect(actual).toEqual({
        address : '1ADei3yngtnFhqJRuKEp2YdNqritUi8icD',
        amount : 0.0736,
        r : 'https://bitpay.com/i/8S37XGmf5MeXUbuvuHcQUk'
      });
    });

    it("does not parse a testnet address", function() {
      var actual = Bitcoin.parseCode('bitcoin%3AmrkkTkkuCWzLzNSn4BpRMCfMPRbfWTvYnJ%3Famount%3D0.0004');

      expect(actual).toBeNull;
    });

  });

});

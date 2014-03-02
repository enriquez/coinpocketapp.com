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

      beforeEach(function(done) {
        setTimeout(function() {
          done();
        }, 1);
      });

      it("generates a valid address", function(done) {
        Bitcoin.Address.generate(function(address) {
          expect(Bitcoin.Address.validate(address)).toBe(true);
          done();
        });
      });

    });

  });

});

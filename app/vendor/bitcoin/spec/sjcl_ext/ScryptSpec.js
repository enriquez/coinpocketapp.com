describe("sjcl.misc.scrypt", function() {

  // https://tools.ietf.org/html/draft-josefsson-scrypt-kdf-00#section-11
  describe("Test Vectors", function() {

    it("returns 77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906", function() {
      var salt = '',
          password = '',
          N = 16,
          r = 1,
          p = 1,
          dklen = 64,
          expected = '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906';

      var result = sjcl.codec.hex.fromBits(sjcl.misc.scrypt(password, salt, N, r, p, dklen));
      expect(result).toEqual(expected);
    });

    it("returns fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640", function() {
      var salt = 'NaCl',
          password = 'password',
          N = 1024,
          r = 8,
          p = 16,
          dklen = 64,
          expected = 'fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640';

      var result = sjcl.codec.hex.fromBits(sjcl.misc.scrypt(password, salt, N, r, p, dklen));
      expect(result).toEqual(expected);
    });

    // Chrome Version 33.0.1750.152 crashes sometimes
    it("returns 7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887", function() {
      var salt = 'SodiumChloride',
          password = 'pleaseletmein',
          N = 16384,
          r = 8,
          p = 1,
          dklen = 64,
          expected = '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887';

      var result = sjcl.codec.hex.fromBits(sjcl.misc.scrypt(password, salt, N, r, p, dklen));
      expect(result).toEqual(expected);
    });

    // Most browsers run out of resources and crash. Works for Safari Version 7.0.3 (9537.75.14)
    // it("returns 2101cb9b6a511aaeaddbbe09cf70f881ec568d574a2ffd4dabe5ee9820adaa478e56fd8f4ba5d09ffa1c6d927c40f4c337304049e8a952fbcbf45c6fa77a41a4", function() {
    //   var salt = 'SodiumChloride',
    //       password = 'pleaseletmein',
    //       N = 1048576,
    //       r = 8,
    //       p = 1,
    //       dklen = 64,
    //       expected = '2101cb9b6a511aaeaddbbe09cf70f881ec568d574a2ffd4dabe5ee9820adaa478e56fd8f4ba5d09ffa1c6d927c40f4c337304049e8a952fbcbf45c6fa77a41a4';

    //   var result = sjcl.codec.hex.fromBits(sjcl.misc.scrypt(password, salt, N, r, p, dklen));
    //   expect(result).toEqual(expected);
    // });

  });
});

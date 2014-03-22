describe("sjcl.hash.ripemd160", function() {

  describe("hash", function() {

    it("hashes '' to '9c1185a5c5e9fc54612808977ee8f548b2258d31'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash(''));
      expect(actual).toEqual('9c1185a5c5e9fc54612808977ee8f548b2258d31');
    });

    it("hashes 'a' to '0bdc9d2d256b3ee9daae347be6f4dc835a467ffe'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash('a'));
      expect(actual).toEqual('0bdc9d2d256b3ee9daae347be6f4dc835a467ffe');
    });

    it("hashes 'abc' to '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash('abc'));
      expect(actual).toEqual('8eb208f7e05d987a9b044a8e98c6b087f15a0bfc');
    });

    it("hashes 'message digest' to '5d0689ef49d2fae572b881b123a85ffa21595f36'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash('message digest'));
      expect(actual).toEqual('5d0689ef49d2fae572b881b123a85ffa21595f36');
    });

    it("hashes 'abcdefghijklmnopqrstuvwxyz' to 'f71c27109c692c1b56bbdceb5b9d2865b3708dbc'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash('abcdefghijklmnopqrstuvwxyz'));
      expect(actual).toEqual('f71c27109c692c1b56bbdceb5b9d2865b3708dbc');
    });

    it("hashes 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq' to '12a053384a9c0c88e405a06c27dcf49ada62eb2b'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'));
      expect(actual).toEqual('12a053384a9c0c88e405a06c27dcf49ada62eb2b');
    });

    it("hashes '12345678901234567890123456789012345678901234567890123456789012345678901234567890' to '9b752e45573d4b39f4dbd3323cab82bf63326bfb'", function() {
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash('12345678901234567890123456789012345678901234567890123456789012345678901234567890'));
      expect(actual).toEqual('9b752e45573d4b39f4dbd3323cab82bf63326bfb');
    });

    it("hashes one million 'a's to '52783243c1697bdbe16d37f97f68f08325dc1528'", function() {
      var millionAs = Array(1000000 + 1).join("a");
      var actual = sjcl.codec.hex.fromBits(sjcl.hash.ripemd160.hash(millionAs));
      expect(actual).toEqual('52783243c1697bdbe16d37f97f68f08325dc1528');
    });

  });

});

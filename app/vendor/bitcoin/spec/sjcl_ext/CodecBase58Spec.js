describe("sjcl.codec.base58", function() {

  describe(".fromBits", function() {

    it("converts '' to ''", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("")))
        .toEqual("");
    });

    it("converts '61' to '2g'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("61")))
        .toEqual("2g");
    });

    it("converts '626262' to 'a3gV'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("626262")))
        .toEqual("a3gV");
    });

    it("converts '636363' to 'aPEr'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("636363")))
        .toEqual("aPEr");
    });

    it("converts '73696d706c792061206c6f6e6720737472696e67' to '2cFupjhnEsSn59qHXstmK2ffpLv2'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("73696d706c792061206c6f6e6720737472696e67")))
        .toEqual("2cFupjhnEsSn59qHXstmK2ffpLv2");
    });

    it("converts '00eb15231dfceb60925886b67d065299925915aeb172c06647' to '1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("00eb15231dfceb60925886b67d065299925915aeb172c06647")))
        .toEqual("1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L");
    });

    it("converts '516b6fcd0f' to 'ABnLTmg'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("516b6fcd0f")))
        .toEqual("ABnLTmg");
    });

    it("converts 'bf4f89001e670274dd' to '3SEo3LWLoPntC'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("bf4f89001e670274dd")))
        .toEqual("3SEo3LWLoPntC");
    });

    it("converts '572e4794' to '3EFU7m'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("572e4794")))
        .toEqual("3EFU7m");
    });

    it("converts 'ecac89cad93923c02321' to 'EJDM8drfXA6uyA'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("ecac89cad93923c02321")))
        .toEqual("EJDM8drfXA6uyA");
    });

    it("converts '10c8511e' to 'Rt5zm'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("10c8511e")))
        .toEqual("Rt5zm");
    });

    it("converts '00000000000000000000' to '1111111111'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("00000000000000000000")))
        .toEqual("1111111111");
    });

    it("does not convert '2a' to '61'", function() {
      expect(sjcl.codec.base58.fromBits(sjcl.codec.hex.toBits("2a")))
        .not.toEqual("61");
    });

  });

  describe(".toBits", function() {

    it("converts '16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM' to '00010966776006953d5567439e5e39f86a0d273beed61967f6'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM")))
        .toEqual("00010966776006953d5567439e5e39f86a0d273beed61967f6");
    });

    it("converts '1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T' to '00c4c5d791fcb4654a1ef5e03fe0ad3d9c598f98274abb8f1a'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("1JwSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T")))
        .toEqual("00c4c5d791fcb4654a1ef5e03fe0ad3d9c598f98274abb8f1a");
    });

    it("converts '11111wSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T' to '00000000000a4bb428c5654dddd0b13d49e9747fa4a61b1d964abb8f1a'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("11111wSSubhmg6iPtRjtyqhUYYH7bZg3Lfy1T")))
        .toEqual("00000000000a4bb428c5654dddd0b13d49e9747fa4a61b1d964abb8f1a");
    });

    it("converts '' to ''", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("")))
        .toEqual("");
    });

    it("converts '2g' to '61'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("2g")))
        .toEqual("61");
    });

    it("converts 'a3gV' to '626262'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("a3gV")))
        .toEqual("626262");
    });

    it("converts 'aPEr' to '636363'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("aPEr")))
        .toEqual("636363");
    });

    it("converts '2cFupjhnEsSn59qHXstmK2ffpLv2' to '73696d706c792061206c6f6e6720737472696e67'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("2cFupjhnEsSn59qHXstmK2ffpLv2")))
        .toEqual("73696d706c792061206c6f6e6720737472696e67");
    });

    it("converts '1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L' to '00eb15231dfceb60925886b67d065299925915aeb172c06647'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L")))
        .toEqual("00eb15231dfceb60925886b67d065299925915aeb172c06647");
    });

    it("converts 'ABnLTmg' to '516b6fcd0f'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("ABnLTmg")))
        .toEqual("516b6fcd0f");
    });

    it("converts '3SEo3LWLoPntC' to 'bf4f89001e670274dd'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("3SEo3LWLoPntC")))
        .toEqual("bf4f89001e670274dd");
    });

    it("converts '3EFU7m' to '572e4794'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("3EFU7m")))
        .toEqual("572e4794");
    });

    it("converts 'EJDM8drfXA6uyA' to 'ecac89cad93923c02321'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("EJDM8drfXA6uyA")))
        .toEqual("ecac89cad93923c02321");
    });

    it("converts 'Rt5zm' to '10c8511e'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("Rt5zm")))
        .toEqual("10c8511e");
    });

    it("converts '1111111111' to '00000000000000000000'", function() {
      expect(sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits("1111111111")))
        .toEqual("00000000000000000000");
    });

    it("does not convert '61' to '2a'", function() {
      var hex    = '61';
          base58 = '2a';

      var bits = sjcl.codec.base58.toBits(base58);
      expect(sjcl.codec.hex.fromBits(bits)).not.toEqual(hex);
    });

  });

});

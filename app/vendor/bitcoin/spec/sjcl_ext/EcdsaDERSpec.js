describe('sjcl.ecc.ecdsa.secretKey', function() {
  var secretKey;

  beforeEach(function() {
    secretKey = new sjcl.ecc.ecdsa.secretKey(sjcl.ecc.curves.k256, sjcl.bn.fromBits(sjcl.codec.hex.toBits('adf5f3601e0af2a91fa3728468469ff92fd82fdd04859887676cc3b9261ef06f')));
  });

  describe('#encodeDER', function() {

    describe('with the sign bit unset for r and s', function() {
      var r, s, rs, rsDER;

      beforeEach(function() {
        r = '571ae293bf6428c41d2ea2bf5145ae87a9d352c003e152c0e72397d3dc675b5b';
        s = '6ab96bd6dcd2198bc81a2506102f1c5fa75d70c3aaa964edbb9112016e61fa7b';
        rs    = sjcl.codec.hex.toBits(r + s);
        rsDER = secretKey.encodeDER(rs);
        rsDERBytes = sjcl.codec.bytes.fromBits(rsDER);
      });

      it('begins with 0x30', function() {
        var actual = rsDERBytes[0].toString(16);
        expect(actual).toEqual('30');
      });

      it('follows with the length of r, s, and 4 header bytes', function() {
        var actual = rsDERBytes[1];
        expect(actual).toEqual(68);
      });

      it('follows with the header byte for INTEGER r', function() {
        var actual = rsDERBytes[2];
        expect(actual).toEqual(2);
      });

      it('follows with length of r', function() {
        var actual = rsDERBytes[3];
        expect(actual).toEqual(32);
      });

      it('follows with r', function() {
        var actual = sjcl.codec.hex.fromBits(sjcl.bitArray.bitSlice(rsDER, 4 * 8, 4 * 8 + 32 * 8));
        expect(actual).toEqual(r);
      });

      it('follows with the header byte for INTEGER s', function() {
        var actual = rsDERBytes[4 + 32];
        expect(actual).toEqual(2);
      });

      it('follows with the length of s', function() {
        var actual = rsDERBytes[4 + 32 + 1];
        expect(actual).toEqual(32);
      });

      it('follows with s', function() {
        var actual = sjcl.codec.hex.fromBits(sjcl.bitArray.bitSlice(rsDER, (4 + 32 + 2) * 8, (4 + 32 + 2) * 8 + 32 * 8));
        expect(actual).toEqual(s);
      });

    });

    describe("with the sign bit set for r and s", function() {
      var r, s, rs, rsDER;

      beforeEach(function() {
        r = 'f81ae293bf6428c41d2ea2bf5145ae87a9d352c003e152c0e72397d3dc675b5b';
        s = 'ffb96bd6dcd2198bc81a2506102f1c5fa75d70c3aaa964edbb9112016e61fa7b';
        rs    = sjcl.codec.hex.toBits(r + s);
        rsDER = secretKey.encodeDER(rs);
        rsDERBytes = sjcl.codec.bytes.fromBits(rsDER);
      });

      it('begins with 0x30', function() {
        var actual = rsDERBytes[0].toString(16);
        expect(actual).toEqual('30');
      });

      it('follows with the length of r, s, and 4 header bytes', function() {
        var actual = rsDERBytes[1];
        expect(actual).toEqual(70);
      });

      it('follows with the header byte for INTEGER r', function() {
        var actual = rsDERBytes[2];
        expect(actual).toEqual(2);
      });

      it('follows with length of r', function() {
        var actual = rsDERBytes[3];
        expect(actual).toEqual(33);
      });

      it('follows with r padded to be signed positive', function() {
        var actual = sjcl.codec.hex.fromBits(sjcl.bitArray.bitSlice(rsDER, 4 * 8, 4 * 8 + 33 * 8));
        expect(actual).toEqual('00' + r);
      });

      it('follows with the header byte for INTEGER s', function() {
        var actual = rsDERBytes[4 + 33];
        expect(actual).toEqual(2);
      });

      it('follows with the length of s', function() {
        var actual = rsDERBytes[4 + 33 + 1];
        expect(actual).toEqual(33);
      });

      it('follows with s padded to be signed positive', function() {
        var actual = sjcl.codec.hex.fromBits(sjcl.bitArray.bitSlice(rsDER, (4 + 33 + 2) * 8, (4 + 33 + 2) * 8 + 33 * 8));
        expect(actual).toEqual('00' + s);
      });

    });

  });

});

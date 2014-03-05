var Bitcoin = function() { };

Bitcoin.paranoia = 10;

Bitcoin.Address = function () { };

Bitcoin.Address.validate = function(address) {
  var isValidFormat = /^1[1-9A-HJ-NP-Za-km-z]{27,33}/.test(address);

  if (isValidFormat) {
    var bits         = sjcl.codec.base58.toBits(address),
        length       = sjcl.bitArray.bitLength(bits),
        ripemdHashed = sjcl.bitArray.clamp(bits, length - 32);
        checksum     = sjcl.bitArray.bitSlice(bits, length - 32);

    var doubleHashed = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(ripemdHashed));

    return sjcl.bitArray.equal(sjcl.bitArray.clamp(doubleHashed, 32), checksum);
  } else {
    return false;
  }
};

Bitcoin.Address.generate = function(hollaback) {
  var curve = sjcl.ecc.curves.k256;
  var keys  = sjcl.ecc.ecdsa.generateKeys(curve, Bitcoin.paranoia);

  var publicKey = sjcl.bitArray.concat(sjcl.bitArray.concat(sjcl.codec.hex.toBits("0x04"), keys.pub.get().x), keys.pub.get().y);

  var hashed = sjcl.bitArray.concat(sjcl.codec.hex.toBits("0x00"),
                                    sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(publicKey)));

  var checkSum = sjcl.bitArray.clamp(sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(hashed)), 32);

  var bitcoinAddress = sjcl.codec.base58.fromBits(sjcl.bitArray.concat(hashed, checkSum));

  hollaback({
    curve: curve,
    privateKeyExponent: keys.sec.get(),
    publicKeyX: keys.pub.get().x,
    publicKeyY: keys.pub.get().y,
    bitcoinAddress: bitcoinAddress
  });
};

Bitcoin.parseCode = function(code) {
  if (Bitcoin.Address.validate(code)) {
    return { address: code };
  }

  var matches = /^(?:bitcoin:)(1[1-9A-HJ-NP-Za-km-z]{27,33})\??(.*)/.exec(code),
      out = {};

  if (matches && matches.length === 3) {
    var address = matches[1],
        params  = matches[2];

    var pairs = params.split("&");
    for(var i=0; i < pairs.length; i++) {
      var split = pairs[i].split("=");

      if (split[0] && split[1]) {
        var key   = decodeURIComponent(split[0]);
        var value = decodeURIComponent(split[1]);

        out[key] = value;
      }
    }

    if (out.amount) {
      out.amount = parseFloat(out.amount);
    }

    out.address = address;
  }

  return out;
}

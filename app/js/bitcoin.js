var Bitcoin = function() { };

Bitcoin.Address = function () { };

Bitcoin.Address.validate = function(address) {
  var isValidFormat = /^1[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{27,33}/.test(address);

  if (isValidFormat) {
    var bits         = sjcl.codec.base58.toBits(address),
        length       = sjcl.bitArray.bitLength(bits),
        ripemdHashed = sjcl.bitArray.clamp(bits, length - 32);
        checksum     = sjcl.bitArray.bitSlice(bits, length - 32), 
        doubleHashed = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(ripemdHashed));

    return sjcl.bitArray.equal(sjcl.bitArray.clamp(doubleHashed, 32), checksum);
  } else {
    return false;
  }
};

Bitcoin.Address.generate = function(hollaback) {
  var keys = sjcl.ecc.ecdsa.generateKeys(sjcl.ecc.curves.k256, 10);

  var publicKey = sjcl.bitArray.concat(sjcl.bitArray.concat(sjcl.codec.hex.toBits("0x04"), keys.pub.get().x), keys.pub.get().y);

  var hashed = sjcl.bitArray.concat(sjcl.codec.hex.toBits("0x00"),
                                    sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(publicKey)));

  var checkSum = sjcl.bitArray.clamp(sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(hashed)), 32);

  var bitcoinAddress = sjcl.codec.base58.fromBits(sjcl.bitArray.concat(hashed, checkSum));

  hollaback(bitcoinAddress);
};

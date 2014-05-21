var Bitcoin = function() { };

Bitcoin.paranoia = 10;

Bitcoin.Address = function () { };

Bitcoin.Address.validate = function(address) {
  var isValidFormat = /^1[1-9A-HJ-NP-Za-km-z]{27,33}/.test(address);

  if (isValidFormat) {
    var bits         = sjcl.codec.base58.toBits(address),
        length       = sjcl.bitArray.bitLength(bits),
        ripemdHashed = sjcl.bitArray.clamp(bits, length - 32),
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

  var bitcoinAddress = Bitcoin.PrivateKey.address(sjcl.codec.hex.fromBits(keys.sec.get()));

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

  var matches = /^(?:bitcoin:)(?:\/\/)?(1[1-9A-HJ-NP-Za-km-z]{27,33})\??(.*)/.exec(code),
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
};

Bitcoin.PrivateKey = function() { };

Bitcoin.PrivateKey._hexToBitsHalfs = function(hex) {
  var bits       = sjcl.codec.hex.toBits(hex);
  var halfLength = sjcl.bitArray.bitLength(bits) / 2;

  return [
    sjcl.bitArray.clamp(bits, halfLength),
    sjcl.bitArray.bitSlice(bits, halfLength)
  ];
};

Bitcoin.PrivateKey.validate = function(privateKey) {
  return Bitcoin.PrivateKey.isHexFormat(privateKey) ||
         Bitcoin.PrivateKey.isUncompressedWIF(privateKey) ||
         Bitcoin.PrivateKey.isBIP38Format(privateKey);
};

Bitcoin.PrivateKey.toHex = function(privateKey, passphrase) {
  if (Bitcoin.PrivateKey.isHexFormat(privateKey)) {
    return privateKey;
  } else if (Bitcoin.PrivateKey.isUncompressedWIF(privateKey)) {
    var bits = sjcl.codec.base58.toBits(privateKey);
    return sjcl.codec.hex.fromBits(sjcl.bitArray.bitSlice(bits, 8, 264));
  } else if (Bitcoin.PrivateKey.isBIP38Format(privateKey)) {
    var bits     = sjcl.codec.base58.toBits(privateKey);
    var flagByte = sjcl.bitArray.bitSlice(bits, 16, 24);
    if (!sjcl.bitArray.equal(flagByte, sjcl.codec.hex.toBits('0xc0'))) {
      throw 'Unsupported format';
    }

    var addressHash = sjcl.bitArray.bitSlice(bits, 24, 56);
    var derivedKey  = sjcl.misc.scrypt(passphrase, addressHash, 16384, 8, 8, 64);
    var derivedKeyHalfs = Bitcoin.PrivateKey._hexToBitsHalfs(sjcl.codec.hex.fromBits(derivedKey));

    var encryptedFirstHalf  = sjcl.bitArray.bitSlice(bits, 56, 184);
    var encryptedSecondHalf = sjcl.bitArray.bitSlice(bits, 184, 312);

    var aes = new sjcl.cipher.aes(derivedKeyHalfs[1]);

    var privateKeyFirstHalf  = sjcl.bitArray._xor4(aes.decrypt(encryptedFirstHalf),  sjcl.bitArray.bitSlice(derivedKeyHalfs[0], 0, 128));
    var privateKeySecondHalf = sjcl.bitArray._xor4(aes.decrypt(encryptedSecondHalf), sjcl.bitArray.bitSlice(derivedKeyHalfs[0], 128));

    var privateKeyHex = sjcl.codec.hex.fromBits(sjcl.bitArray.concat(privateKeyFirstHalf, privateKeySecondHalf));

    var addressHashCheck = sjcl.bitArray.bitSlice((sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(Bitcoin.PrivateKey.address(privateKeyHex)))), 0, 32);
    if (!sjcl.bitArray.equal(addressHashCheck, addressHash)) {
      throw 'Incorrect passphrase';
    }

    return privateKeyHex;
  }
};

Bitcoin.PrivateKey.isHexFormat = function(privateKey) {
  return (new RegExp('^[0-9a-f]{64}$', 'i')).test(privateKey);
};

Bitcoin.PrivateKey.isUncompressedWIF = function(privateKey) {
  var isValidFormat = (new RegExp('^5[1-9A-HJ-NP-Za-km-z]{50}$')).test(privateKey);

  if (isValidFormat) {
    var bits = sjcl.codec.base58.toBits(privateKey),
        length = sjcl.bitArray.bitLength(bits),
        withVersion = sjcl.bitArray.clamp(bits, length - 32),
        doubleHashed = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(withVersion)),
        checksum = sjcl.bitArray.clamp(doubleHashed, 32);

    return sjcl.bitArray.equal(sjcl.bitArray.bitSlice(bits, length - 32), checksum);
  } else {
    return false;
  }
};

Bitcoin.PrivateKey.isBIP38Format = function(privateKey) {
  var isValidFormat = (new RegExp('^6PR[1-9A-HJ-NP-Za-km-z]{55}$')).test(privateKey);

  return isValidFormat;
};

Bitcoin.PrivateKey.address = function(privateKey) {
  var curve = sjcl.ecc.curves.k256;
  var exponent = sjcl.bn.fromBits(sjcl.codec.hex.toBits(privateKey));
  var secretKey = new sjcl.ecc.ecdsa.secretKey(curve, exponent);
  var publicKey = new sjcl.ecc.ecdsa.publicKey(curve, sjcl.ecc.curves.k256.G.mult(exponent));

  var publicKeyHex = sjcl.bitArray.concat(sjcl.bitArray.concat(sjcl.codec.hex.toBits("0x04"), publicKey.get().x), publicKey.get().y); 
  var hashed = sjcl.bitArray.concat(sjcl.codec.hex.toBits("0x00"),
                                    sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(publicKeyHex)));
  var checkSum = sjcl.bitArray.clamp(sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(hashed)), 32);

  return sjcl.codec.base58.fromBits(sjcl.bitArray.concat(hashed, checkSum));
};

Bitcoin.PrivateKey.wif = function(privateKey) {
  var withVersion = sjcl.codec.hex.toBits('80' + privateKey);
  var hashed = sjcl.hash.sha256.hash(withVersion);
  var doubleHashed = sjcl.hash.sha256.hash(hashed);
  var checkSum = sjcl.bitArray.clamp(doubleHashed, 32);

  return sjcl.codec.base58.fromBits(sjcl.bitArray.concat(withVersion, checkSum));
};

Bitcoin.PrivateKey.bip38 = function(passphrase, privateKey) {
  var addressHash = sjcl.bitArray.bitSlice((sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(Bitcoin.PrivateKey.address(privateKey)))), 0, 32);
  var derivedKey  = sjcl.misc.scrypt(passphrase, addressHash, 16384, 8, 8, 64);

  var derivedKeyHalfs = Bitcoin.PrivateKey._hexToBitsHalfs(sjcl.codec.hex.fromBits(derivedKey));
  var privateKeyHalfs = Bitcoin.PrivateKey._hexToBitsHalfs(privateKey);

  var aes = new sjcl.cipher.aes(derivedKeyHalfs[1]);

  var encryptedFirstHalf  = aes.encrypt(sjcl.bitArray._xor4(privateKeyHalfs[0], sjcl.bitArray.bitSlice(derivedKeyHalfs[0], 0, 128)));
  var encryptedSecondHalf = aes.encrypt(sjcl.bitArray._xor4(privateKeyHalfs[1], sjcl.bitArray.bitSlice(derivedKeyHalfs[0], 128)));

  var encryptedPrivateKey = sjcl.bitArray.concat(sjcl.codec.hex.toBits('0x0142c0'), sjcl.bitArray.concat(addressHash, sjcl.bitArray.concat(encryptedFirstHalf, encryptedSecondHalf)));
  var checkSum = sjcl.bitArray.clamp(sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(encryptedPrivateKey)), 32);

  var result = sjcl.bitArray.concat(encryptedPrivateKey, checkSum);

  return sjcl.codec.base58.fromBits(result);
};

Bitcoin.Transaction = function() {
  this.outputs = [];
  this.inputs = [];

  this._bigToLittleEndian = function(hex, sizeInBytes) {
    if (hex.length % 2 === 1) { // odd length
      hex = "0" + hex;
    }
    if (typeof sizeInBytes === 'undefined') {
      sizeInBytes = hex.length / 2;
    }

    var out = '', zeros = 0;
    for (var i=sizeInBytes; i > 0; i--) {
      var currentByte = hex.substr((i * 2) - 2, 2);
      if (currentByte === '') {
        zeros++;
      } else {
        out += currentByte;
      }
    }

    while(zeros > 0) {
      out += "00";
      zeros--;
    }

    return out;
  };

  this._btcTo8ByteLittleEndianHex = function(btc) {
    var amountInSatoshis = parseInt((btc * 100000000).toFixed(0), 10);
    return this._bigToLittleEndian(amountInSatoshis.toString(16), 8);
  };

  this._bitcoinAddressToPubKeyHash = function(address) {
    var addressHex = sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits(address));
    return addressHex.substring(2, addressHex.length - 8);
  };

  this._variableInt = function(integer) {
    var result = '';

    if (integer < 0xfd) {
      result = this._bigToLittleEndian(integer.toString(16), 1);
    } else if (integer <= 0xffff) {
      result = this._bigToLittleEndian(integer.toString(16), 2);
      result = "fd" + result;
    } else if (integer <= 0xffffffff) {
      result = this._bigToLittleEndian(integer.toString(16), 4);
      result = "fe" + result;
    } else {
      result = this._bigToLittleEndian(integer.toString(16), 8);
      result = "ff" + result;
    }

    return result;
  };

  this._byteLength = function(hex) {
    return this._variableInt(hex.length / 2);
  };

};

Bitcoin.Transaction.prototype.addPayToPubKeyHashOutput = function(address, amount) {
  if (!Bitcoin.Address.validate(address)) {
    throw "Invalid Bitcoin address";
  }
  if (amount < 0.00000001) {
    throw "Invalid amount. Must be more than 0.00000001 BTC";
  }

  var output = '';

  var value = this._btcTo8ByteLittleEndianHex(amount);

  var script = '76a9'; // OP_DUP OP_HASH160
  var pubKeyHash = this._bitcoinAddressToPubKeyHash(address);
  script += this._byteLength(pubKeyHash);
  script += pubKeyHash;
  script += '88ac'; // OP_EQUALVERIFY OP_CHECKSIG

  var scriptLength = this._byteLength(script);

  output += value;
  output += scriptLength;
  output += script;
  this.outputs.push(output);
};

Bitcoin.Transaction.prototype.addInput = function(unspentOutput) {
  var self = this;

  var input = {
    hash: unspentOutput.tx_hash,
    index: this._bigToLittleEndian(parseInt(unspentOutput.tx_output_n, 10).toString(16), 4),
    script: unspentOutput.script
  };

  input.rawHex = function(overrideScript) {
    var hex = '';
    hex += this.hash;
    hex += this.index;

    var script;
    if (typeof overrideScript === 'undefined') {
      script = this.script;
    } else {
      script = overrideScript;
    }

    hex += self._byteLength(script);
    hex += script;
    hex += 'ffffffff';

    return hex;
  };

  this.inputs.push(input);
};

Bitcoin.Transaction.prototype.rawHex = function(inputsOverride) {
  var rawHex = '';
  rawHex += '01000000'; // version

  // number of inputs
  rawHex += this._variableInt(this.inputs.length);

  // inputs
  if (typeof inputsOverride === 'string') {
    rawHex += inputsOverride;
  } else {
    for (var i=0; i < this.inputs.length; i++) {
      rawHex += this.inputs[i].rawHex();
    }
  }

  // number of outputs
  rawHex += this._variableInt(this.outputs.length);

  // outputs
  for (var j=0; j < this.outputs.length; j++) {
    rawHex += this.outputs[j];
  }

  // lock_time
  rawHex += '00000000';

  return rawHex;
};

Bitcoin.Transaction.prototype.sign = function(privateKeyExponent, publicKeyX, publicKeyY) {
  var secretKey = new sjcl.ecc.ecdsa.secretKey(sjcl.ecc.curves.k256, sjcl.bn.fromBits(sjcl.codec.hex.toBits(privateKeyExponent)));
  var publicKey = '04' + publicKeyX + publicKeyY;
  var signedInputs = '';

  for (var i=0; i < this.inputs.length; i++) {
    var inputs = '';
    for (var j=0; j < this.inputs.length; j++) {
      if (i === j) {
        inputs += this.inputs[j].rawHex();
      } else {
        inputs += this.inputs[j].rawHex('');
      }
    }

    var transactionForSigning = this.rawHex(inputs) + '01000000';

    var doubleHashed = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(transactionForSigning)));

    var signatureDER = sjcl.codec.hex.fromBits(secretKey.signDER(doubleHashed, 10)) + '01';

    var scriptSig = this._byteLength(signatureDER) + signatureDER + '41' + publicKey;

    signedInputs += this.inputs[i].rawHex(scriptSig);
  }

  var rawHex = this.rawHex(signedInputs);
  return rawHex;
};

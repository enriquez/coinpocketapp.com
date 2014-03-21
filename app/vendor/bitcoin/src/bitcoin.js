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
  }

  this._btcTo8ByteLittleEndianHex = function(btc) {
    var amountInSatoshis = btc * 100000000;
    return this._bigToLittleEndian(amountInSatoshis.toString(16), 8);
  }

  this._bitcoinAddressToPubKeyHash = function(address) {
    var addressHex = sjcl.codec.hex.fromBits(sjcl.codec.base58.toBits(address));
    return addressHex.substring(2, addressHex.length - 8);
  }

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
  }

  this._byteLength = function(hex) {
    return this._variableInt(hex.length / 2);
  }

}

Bitcoin.Transaction.prototype.addPayToPubKeyHashOutput = function(address, amount) {
  if (!Bitcoin.Address.validate(address)) {
    throw "Invalid Bitcoin address";
  }
  if (amount < 0.00000001) {
    throw "Invalid amount. Must be more than 0.00000001 BTC";
  }

  var output = '';

  var value = this._btcTo8ByteLittleEndianHex(amount)

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
}

Bitcoin.Transaction.prototype.addInput = function(unspentOutput) {
  var self = this;

  var input = {
    hash: unspentOutput.tx_hash,
    index: this._bigToLittleEndian(parseInt(unspentOutput.tx_output_n).toString(16), 4),
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
  }

  this.inputs.push(input);
}

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
  for (var i=0; i < this.outputs.length; i++) {
    rawHex += this.outputs[i];
  }

  // lock_time
  rawHex += '00000000';

  return rawHex;
}

Bitcoin.Transaction.prototype.sign = function(privateKeyExponent, publicKeyX, publicKeyY) {
  var secretKey = new sjcl.ecc.ecdsa.secretKey(sjcl.ecc.curves.k256, sjcl.bn.fromBits(sjcl.codec.hex.toBits(privateKeyExponent)));
  var publicKey = '04' + publicKeyX + publicKeyY;
  var signedInputs = '';

  for (var i=0; i < this.inputs.length; i++) {
    var inputs = '';
    for (var j=0; j < this.inputs.length; j++) {
      if (i === j) {
        inputs += this.inputs[i].rawHex();
      } else {
        inputs += this.inputs[i].rawHex('');
      }
    }

    var transactionForSigning = this.rawHex(inputs) + '01000000';

    var doubleHashed = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(transactionForSigning)));
    var signature = sjcl.codec.hex.fromBits(secretKey.sign(doubleHashed, 10));
    var coordinateLength = signature.length / 2;

    var rCoordinate = signature.substr(0, coordinateLength);
    var sCoordinate = signature.substr(coordinateLength);

    if (parseInt(rCoordinate.substr(0, 2), 16) >= 0x7f) {
      rCoordinate = "00" + rCoordinate;
    }

    if (parseInt(sCoordinate.substr(0, 2), 16) >= 0x7f) {
      sCoordinate = "00" + sCoordinate;
    }

    var signatureR = '02' + (rCoordinate.length / 2).toString(16) + rCoordinate;
    var signatureS = '02' + (sCoordinate.length / 2).toString(16) + sCoordinate;

    var signatureDER = '30' + ((signatureR.length + signatureS.length) / 2).toString(16) + signatureR + signatureS + '01';

    var scriptSig = this._byteLength(signatureDER) + signatureDER + '41' + publicKey;

    signedInputs += this.inputs[i].rawHex(scriptSig);
  }

  var rawHex = this.rawHex(signedInputs);
  return rawHex;
}

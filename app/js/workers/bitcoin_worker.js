importScripts("/vendor/sjcl/core/sjcl.js",
              "/vendor/sjcl/core/bitArray.js",
              "/vendor/sjcl/core/codecString.js",
              "/vendor/sjcl/core/aes.js",
              "/vendor/sjcl/core/sha256.js",
              "/vendor/sjcl/core/random.js",
              "/vendor/sjcl/core/bn.js",
              "/vendor/sjcl/core/ecc.js",
              "/vendor/sjcl/core/codecBase64.js",
              "/vendor/sjcl/core/codecHex.js",
              "/vendor/sjcl/core/codecBytes.js",
              "/vendor/sjcl/core/hmac.js",
              "/vendor/sjcl/core/pbkdf2.js",
              "/vendor/sjcl/core/ccm.js",
              "/vendor/sjcl/core/convenience.js",
              "/vendor/bitcoin/src/sjcl_ext/codecBase58.js",
              "/vendor/bitcoin/src/sjcl_ext/ecdsaDER.js",
              "/vendor/bitcoin/src/sjcl_ext/ripemd160.js",
              "/vendor/bitcoin/src/bitcoin.js");

var seedGenerateAndEncryptKeys = function(seed, password, hollaback) {
  if (seed.length < 32) throw "Seed must be 32 words";
  if (password.length < 4) throw "Password must be at least 4 characters";

  sjcl.random.addEntropy(seed, 1024, "client");
  Bitcoin.Address.generate(function(obj) {
    var keyPair = {};
    keyPair.encryptedPrivateKeyExponent = sjcl.json.encrypt(password, sjcl.codec.hex.fromBits(obj.privateKeyExponent));
    keyPair.publicKeyX = sjcl.codec.hex.fromBits(obj.publicKeyX);
    keyPair.publicKeyY = sjcl.codec.hex.fromBits(obj.publicKeyY);
    keyPair.bitcoinAddress = obj.bitcoinAddress;

    hollaback(keyPair);
  });
};

var parseCode = function(code, hollaback) {
  var result = Bitcoin.parseCode(code);
  hollaback(result);
};

var validateAddress = function(address, hollaback) {
  var result = Bitcoin.Address.validate(address);
  hollaback(result);
};

var buildAndSignRawTransaction = function(seed, password, keyPair, inputs, outputs, hollaback) {
  if (seed.length < 32) throw "Seed must be 32 words";
  sjcl.random.addEntropy(seed, 1024, "client");

  var transaction = new Bitcoin.Transaction();

  for (var i=0; i<inputs.length; i++) {
    var input = inputs[i];
    transaction.addInput(input);
  }

  for (var j=0; j<outputs.length; j++) {
    var output = outputs[j];
    transaction.addPayToPubKeyHashOutput(output.address, output.amount);
  }

  try {
    var privateKeyExponent = sjcl.json.decrypt(password, keyPair.encryptedPrivateKeyExponent);
    var result = transaction.sign(privateKeyExponent, keyPair.publicKeyX, keyPair.publicKeyY);
    hollaback(result);
  } catch (e) {
    if (e instanceof sjcl.exception.corrupt) {
      hollaback({ error: 'Invalid Password' });
    } else {
      hollaback({ error: 'Error: ' + e.message });
    }
  }
};

var messageListener = function(e) {
  if (e.data) {
    var id = e.data.id,
        functionName = e.data.functionName,
        params = e.data.params;

    var fn = self[functionName];

    params.push(function(result) {
      var message = {
        id: id,
        result: result
      };

      self.postMessage(message);
    });

    if (typeof fn === "function") {
      fn.apply(null, params);
    }
  }
};

self.addEventListener('message', messageListener);

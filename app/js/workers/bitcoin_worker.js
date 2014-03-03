importScripts("/vendor/sjcl/sjcl.js",
              "/vendor/sjcl/core/bn.js",
              "/vendor/sjcl/core/ecc.js",
              "/vendor/bitcoin/src/sjcl_ext/codecBase58.js",
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
}

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
      }

      self.postMessage(message)
    });

    if (typeof fn === "function") {
      fn.apply(null, params);
    }
  }
}

self.addEventListener('message', messageListener);

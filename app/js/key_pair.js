(function(Bitcoin, sjcl, Models) {

  var self = Models.KeyPair = function() { };

  self.generate = function(password, hollaback) {
    Bitcoin.Address.generate(function(obj) {
      var keyPair = new Models.KeyPair();
      keyPair.encryptedPrivateKeyExponent = sjcl.json.encrypt(password, sjcl.codec.hex.fromBits(obj.privateKeyExponent));
      keyPair.publicKeyX = obj.publicKeyX;
      keyPair.publicKeyY = obj.publicKeyY;
      keyPair.curve = obj.curve;
      keyPair.bitcoinAddress = obj.bitcoinAddress;

      self.keyPair = keyPair;
      if (typeof hollaback !== undefined) {
        hollaback(keyPair);
      }
      CoinPocketApp.events.trigger('KeyPair.generate', keyPair);
    });
  };

  MicroEvent.mixin(Models.KeyPair);

  self.hasKeyPair = function() {
    return typeof self.keyPair !== "undefined";
  };

})(Bitcoin, sjcl, CoinPocketApp.Models);

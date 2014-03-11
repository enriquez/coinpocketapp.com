(function(bitcoinWorker, Models) {

  function KeyPair() {
    self = this;
    self.isGenerated = false;
  }

  KeyPair.prototype.generate = function(password, hollaback) {
    var self = this;

    var params = [
      Models.entropy.randomWords(32),
      password
    ];

    bitcoinWorker.async("seedGenerateAndEncryptKeys", params, function(keyPair) {
      self.isGenerated = true;

      self.encryptedPrivateKeyExponent = keyPair.encryptedPrivateKeyExponent;
      self.publicKeyX = keyPair.publicKeyX;
      self.publicKeyY = keyPair.publicKeyY;
      self.bitcoinAddress = keyPair.bitcoinAddress;

      if (typeof hollaback === "function") {
        hollaback(keyPair);
      }
      self.trigger('keyPair.generate', keyPair);
    });

  };

  MicroEvent.mixin(KeyPair);
  Models.keyPair = new KeyPair();

})(CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models);

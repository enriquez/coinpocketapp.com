(function(bitcoinWorker, entropy, Models) {

  function KeyPair() {
    var self = this;

    if (self.restoreFromStore()) {
      self.isGenerated = true;
    } else {
      self.isGenerated = false;
    }
  }

  KeyPair.prototype.saveToStore = function() {
    var self = this;

    localStorage.setItem('keyPairStore', JSON.stringify({
      encryptedPrivateKeyExponent: self.encryptedPrivateKeyExponent,
      publicKeyX: self.publicKeyX,
      publicKeyY: self.publicKeyY,
      bitcoinAddress: self.bitcoinAddress
    }));
  };

  KeyPair.prototype.restoreFromStore = function() {
    var self = this,
        keyPairStore = localStorage.getItem('keyPairStore');

    if (keyPairStore) {
      var keyPairStoreData = JSON.parse(keyPairStore);
      self.encryptedPrivateKeyExponent = keyPairStoreData.encryptedPrivateKeyExponent;
      self.publicKeyX = keyPairStoreData.publicKeyX;
      self.publicKeyY = keyPairStoreData.publicKeyY;
      self.bitcoinAddress = keyPairStoreData.bitcoinAddress;

      return true;
    } else {
      return false;
    }
  };

  KeyPair.prototype.generate = function(password, hollaback) {
    var self = this;

    var params = [
      entropy.randomWords(32),
      password
    ];

    bitcoinWorker.asyncNewThread("seedGenerateAndEncryptKeys", params, function(keyPair) {
      self.isGenerated = true;

      self.encryptedPrivateKeyExponent = keyPair.encryptedPrivateKeyExponent;
      self.publicKeyX = keyPair.publicKeyX;
      self.publicKeyY = keyPair.publicKeyY;
      self.bitcoinAddress = keyPair.bitcoinAddress;

      self.saveToStore();

      if (typeof hollaback === "function") {
        hollaback(keyPair);
      }
      self.trigger('keyPair.generate', keyPair);
    });

  };

  MicroEvent.mixin(KeyPair);
  Models.keyPair = new KeyPair();

})(CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models.entropy, CoinPocketApp.Models);

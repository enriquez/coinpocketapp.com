(function(Models) {

  function KeyPair() {
    self = this;

    self.isGenerated = false;

    self.bitcoin_worker = new Worker('/js/workers/bitcoin_worker.js');
    self.bitcoin_worker.postMessage();
    self.bitcoin_worker.currentMessageId = 0;
    self.bitcoin_worker.callbacks = {};
    self.bitcoin_worker.onmessage = function(e) {
      var message = e.data;
      self.bitcoin_worker.callbacks[message.id].apply(null, [message.result]);
      delete self.bitcoin_worker.callbacks[message.id];
    };

    self.bitcoin_worker.async = function(functionName, params, hollaback) {
      var message = {
        id: self.bitcoin_worker.currentMessageId,
        functionName: functionName,
        params: params,
      };

      self.bitcoin_worker.callbacks[message.id] = hollaback;
      self.bitcoin_worker.postMessage(message);

      self.bitcoin_worker.currentMessageId++;
    };
  }

  KeyPair.prototype.generate = function(password, hollaback) {
    var self = this;

    var params = [
      Models.entropy.randomWords(32),
      password
    ];

    self.bitcoin_worker.async("seedGenerateAndEncryptKeys", params, function(keyPair) {
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

})(CoinPocketApp.Models);

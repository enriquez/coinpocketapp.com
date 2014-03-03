(function(Models) {

  var self = Models.KeyPair = function() { };

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

  self.generate = function(password, hollaback) {

    var params = [
      Models.Entropy.entropy.randomWords(32),
      password
    ];

    self.bitcoin_worker.async("seedGenerateAndEncryptKeys", params, function(keyPair) {
      self.keyPair = keyPair;
      if (typeof hollaback === "function") {
        hollaback(keyPair);
      }
      CoinPocketApp.events.trigger('KeyPair.generate', keyPair);
    });

  };

  MicroEvent.mixin(Models.KeyPair);

  self.hasKeyPair = function() {
    return typeof self.keyPair !== "undefined";
  };

})(CoinPocketApp.Models);

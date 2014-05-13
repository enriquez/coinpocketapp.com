(function(bitcoinWorker, Models) {

  function PrivateKey(data) {
    var self = this;
    self._data = data;

    self.isValid = function(hollaback) {
      var params = [self._data];
      bitcoinWorker.async('validatePrivateKey', params, function(result) {
        if (typeof hollaback === 'function') {
          hollaback(result);
        }
      });
    };

    self.address = function(hollaback) {
      var params = [self._data];
      bitcoinWorker.async('addressForPrivateKey', params, function(address) {
        if (typeof hollaback === 'function') {
          hollaback(address);
        }
      });
    };

    self.wif = function(hollaback) {
      if (self.wifCache) {
        if (typeof hollaback === 'function') {
          hollaback(self.wifCache);
        }
      } else {
        var params = [self._data];
        bitcoinWorker.async('wifForPrivateKey', params, function(wif) {
          self.wifCache = wif;
          if (typeof hollaback === 'function') {
            hollaback(self.wifCache);
          }
        });
      }
    };
  }

  MicroEvent.mixin(PrivateKey);
  Models.PrivateKey = PrivateKey;

})(CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models);

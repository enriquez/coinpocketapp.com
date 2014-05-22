(function(bitcoinWorker, keyPair, Models) {

  function PrivateKey(data) {
    var self = this;
    self._data = data;

    self.isValid = function(hollaback) {
      var params = [self._data];
      bitcoinWorker.asyncNewThread('validatePrivateKey', params, function(result) {
        if (typeof hollaback === 'function') {
          hollaback(result);
        }
      });
    };

    self.address = function(hollaback) {
      var params = [self._data];
      bitcoinWorker.asyncNewThread('addressForPrivateKey', params, function(address) {
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
        bitcoinWorker.asyncNewThread('wifForPrivateKey', params, function(wif) {
          self.wifCache = wif;
          if (typeof hollaback === 'function') {
            hollaback(self.wifCache);
          }
        });
      }
    };

    self.bip38 = function(passphrase, hollaback) {
      if (self.bip38Cache) {
        if (typeof hollaback === 'function') {
          hollaback(self.bip38Cache);
        }
      } else {
        var params = [passphrase, self._data];
        bitcoinWorker.asyncNewThread('bip38ForPrivateKey', params, function(bip38) {
          self.bip38Cache = bip38;
          if (typeof hollaback === 'function') {
            hollaback(self.bip38Cache);
          }
        });
      }
    };

    self.bip38decrypt = function(password, hollaback) {
      var params = [password, self._data];
      bitcoinWorker.asyncNewThread('bip38DecryptPrivateKey', params, function(result) {
        if (result.error) {
          hollaback(result);
        } else {
          self._data = result;
          if (typeof hollaback === 'function') {
            hollaback(result);
          }
        }
      });
    };
  }

  PrivateKey.fromWallet = function(password, hollaback) {
    var params = [password, keyPair.encryptedPrivateKeyExponent];
    bitcoinWorker.asyncNewThread('decryptPrivateKey', params, function(result) {
      if (typeof hollaback === 'function') {
        if (result.error) {
          hollaback(result);
        } else {
          var privateKey = new PrivateKey(result);
          hollaback(privateKey);
        }
      }
    });
  };

  MicroEvent.mixin(PrivateKey);
  Models.PrivateKey = PrivateKey;

})(CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models.keyPair, CoinPocketApp.Models);

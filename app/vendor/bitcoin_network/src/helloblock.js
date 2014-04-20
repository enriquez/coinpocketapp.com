var HelloBlock = (function(self, $) {

  function Wallet() { }
  function Addresses() { }
  function Blocks() { }
  function Transactions() { }

  self._url = function(address, path) {
    return 'https://mainnet.helloblock.io/v1/addresses/' + address + path;
  }

  self._getJSONForPath = function(url, params, hollaback) {
    $.getJSON(url, params, function(data) {
      if (data.status === 'success') {
        hollaback(data.data, true);
      } else {
        hollaback({}, false);
      }
    });
  }

  Wallet.get = function(address, params, hollaback) {
    var url = 'https://mainnet.helloblock.io/v1/wallet';
    params = params || {};
    params.addresses = [address];
    self._getJSONForPath(url, params, hollaback);
  };

  Addresses.unspents = function(address, params, hollaback) {
    var url = self._url(address, '/unspents');
    self._getJSONForPath(url, params, hollaback);
  }

  Blocks.latest = function(hollaback) {
    var url = 'https://mainnet.helloblock.io/v1/blocks/latest?limit=1';
    self._getJSONForPath(url, {}, hollaback);
  };

  Transactions.propogate = function(rawTxHex, hollaback) {
    $.post('https://mainnet.helloblock.io/v1/transactions/', { rawTxHex: rawTxHex }, function(data, status, xhr) {
      if (data.status === 'success') {
        hollaback(true, true);
      } else {
        hollaback(false, false);
      }
    });
  };

  self.Wallet = Wallet;
  self.Addresses = Addresses;
  self.Blocks = Blocks;
  self.Transactions = Transactions;

  return self;
})({}, jQuery);

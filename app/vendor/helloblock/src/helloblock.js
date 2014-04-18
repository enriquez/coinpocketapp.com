var HelloBlock = (function(self, $) {

  function Addresses() { }
  function Transactions() { }

  self._url = function(address, path) {
    return 'https://mainnet.helloblock.io/v1/addresses/' + address + path;
  }

  self._getJSON = function(url, params, hollaback) {
    $.getJSON(url, params, function(data) {
      if (data.status === 'success') {
        hollaback(data.data);
      } else {
        hollaback({});
      }
    });
  }

  Addresses.unspents = function(address, params, hollaback) {
    var url = self._url(address, '/unspents');
    self._getJSON(url, params, hollaback);
  }

  Addresses.transactions = function(address, params, hollaback) {
    var url = self._url(address, '/transactions');
    self._getJSON(url, params, hollaback);
  };

  Transactions.propogate = function(rawTxHex, hollaback) {
    $.post('https://mainnet.helloblock.io/v1/transactions/', { rawTxHex: rawTxHex }, function(data, status, xhr) {
      if (data.status === 'success') {
        hollaback(true);
      } else {
        hollaback(false);
      }
    });
  };

  self.Addresses = Addresses;
  self.Transactions = Transactions;

  return self;
})({}, jQuery);

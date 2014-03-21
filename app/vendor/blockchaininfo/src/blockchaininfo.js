var BlockChainInfo = (function(self, $) {

  function getJSONForPath(path, hollaback) {
    var url = 'http://blockchain.info' + path;
    var yql = "select * from json where url=\"" + url + "\"";
    $.getJSON("https://query.yahooapis.com/v1/public/yql", {
      q: yql,
      format: 'json',
      jsonCompat: 'new'
    }, function(data) {
      if (data.query.results) {
        hollaback(data.query.results.json);
      } else {
        hollaback({});
      }
    });
  }

  self.rawaddr = function(address, hollaback) {
    getJSONForPath('/rawaddr/' + address, hollaback);
  };

  self.latestblock = function(hollaback) {
    getJSONForPath('/latestblock', hollaback);
  };

  self.unspent = function(address, hollaback) {
    getJSONForPath('/unspent?active=' + address, hollaback);
  };

  self.pushtx = function(tx, hollaback) {
    var url = 'http://blockchain.info/pushtx',
        postData = 'tx=' + tx;
  };

  function WS() {
    if (WS.prototype._singleton) {
      return WS.prototype._singleton;
    } else {
      WS.prototype._singleton = this;
    }

    var self = this;

    self.delayedMessages = [];
    self.subscriptions = [];
    self.isConnected = false;

    self.webSocket = new WebSocket('wss://ws.blockchain.info/inv');

    self.webSocket.onopen = function(e) {
      console.log('open');
      self.isConnected = true;

      while (self.delayedMessages.length > 0) {
        var delayedMessage = self.delayedMessages.pop();
        self.sendMessage(delayedMessage);
      }
    };

    self.webSocket.onclose = function(e) {
      console.log('close');
      self.isConnected = false;
    };

    self.webSocket.onmessage = function(e) {
      var data = JSON.parse(e.data),
          op   = data.op;

      if (self.subscriptions[op]) {
        for (var i = 0; i<self.subscriptions[op].length; i++) {
          var hollaback = self.subscriptions[op][i]
          hollaback(data);
        }
      }
    };

    self.webSocket.onerror = function(e) {
      console.log('BlockChainInfo WebSocket Error: ', e);
    };
  }

  WS.prototype.sendMessage = function(obj) {
    if (this.isConnected) {
      this.webSocket.send(JSON.stringify(obj));
    } else {
      this.delayedMessages.push(obj);
    }
  }

  WS.prototype.onNewBlock = function(hollaback) {
    var self = this;
    if (!self.subscriptions['block']) {
      self.subscriptions['block'] = [];
    }

    self.subscriptions['block'].push(hollaback);
    self.sendMessage({ op: 'ping_block' });
    self.sendMessage({ op: 'blocks_sub' });
  };

  WS.prototype.onNewTransactionForAddress = function(address, hollaback) {
    var self = this;
    if (!self.subscriptions['utx']) {
      self.subscriptions['utx'] = [];
    }

    self.subscriptions['utx'].push(hollaback);
    self.sendMessage({ op: 'addr_sub', addr: address });
  };

  self.WebSocket = WS;
  return self;
})({}, jQuery);

var BlockChainInfo = (function(self, $) {

  function getJSONForPath(path, hollaback) {
    var url = 'https://blockchain.info' + path;
    $.ajax({
      type: 'GET',
      url: url,
      data: { cors: 'true' },
      success: function(data) {
        hollaback(data);
      },
      error: function(xhr, opt, err) {
        hollaback({});
      }
    });
  }

  self.multiaddr = function(address, hollaback) {
    getJSONForPath('/multiaddr?active=' + address, hollaback);
  };

  self.unspent = function(address, hollaback) {
    getJSONForPath('/unspent?active=' + address, hollaback);
  };

  self.pushtx = function(tx, hollaback) {
    var url = 'https://blockchain.info/pushtx?cors=true',
        postData = { tx: tx };

    $.ajax({
      type: 'POST',
      url: url,
      data: postData,
      success: function(res) {
        hollaback(true);
      },
      error: function(xhr, opt, err) {
        hollaback(false);
      }
    });
  };

  function WS() {
    if (WS.prototype._singleton) {
      return WS.prototype._singleton;
    } else {
      WS.prototype._singleton = this;
    }

    var self = this;

    self.delayedMessages = [];
    self.subscriptions = {};
    self.reconnectFailureCallbacks = [];
    self.connectSuccessCallbacks = [];
    self.isConnected = false;
    self.reconnectAttempts = 5;

    self.connect = function() {
      self.webSocket = new WebSocket('wss://ws.blockchain.info/inv');

      self.webSocket.onopen = function(e) {
        self.isConnected = true;

        while (self.delayedMessages.length > 0) {
          var delayedMessage = self.delayedMessages.pop();
          self.sendMessage(delayedMessage);
        }

        for (var i=0;i<self.connectSuccessCallbacks.length;i++) {
          self.connectSuccessCallbacks[i].call();
        }
      };

      self.webSocket.onclose = function(e) {
        self.isConnected = false;

        if (self.reconnectAttempts > 0) {
          self.reconnectAttempts--;
          self.connect();

          // re-subscribe new blocks when reconnecting
          if (self.subscriptions['block'] && self.subscriptions['block'].length > 0) {
            self.sendMessage({ op: 'ping_block' });
            self.sendMessage({ op: 'blocks_sub' });
          }

          // re-subscribe new transactions when reconnecting
          if (self.subscriptions['utx'] && self.subscriptions['utx'].length > 0) {
            for (var i=0;i<self.subscriptions['utx_addresses'].length;i++) {
              var address = self.subscriptions['utx_addresses'][i];
              self.sendMessage({ op: 'addr_sub', addr: address });
            }
          }
        } else {
          for (var i=0; i<self.reconnectFailureCallbacks.length; i++) {
            self.reconnectFailureCallbacks[i].call();
          }
        }
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

    self.connect();
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
      self.subscriptions['utx_addresses'] = [];
    }

    self.subscriptions['utx'].push(hollaback);
    self.subscriptions['utx_addresses'].push(address);
    self.sendMessage({ op: 'addr_sub', addr: address });
  };

  WS.prototype.onReconnectFailure = function(hollaback) {
    this.reconnectFailureCallbacks.push(hollaback);
  };

  WS.prototype.onConnectSuccess = function(hollaback) {
    this.connectSuccessCallbacks.push(hollaback);
  };

  self.WebSocket = WS;
  return self;
})({}, jQuery);

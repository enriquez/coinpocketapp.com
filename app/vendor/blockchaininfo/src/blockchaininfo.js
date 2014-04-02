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
        postData = 'tx=' + tx,
        htmlpostUrl = document.location.protocol + "//" + document.location.host + '/htmlpost.xml';
    var yql = 'use "' + htmlpostUrl + '" as htmlpost; select * from htmlpost where url="' + url + '" and postdata="' + postData + '" and xpath="//p"';
    var yahooapiUrl = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql);

    $.ajax({
      url: yahooapiUrl,
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
          if (self.subscriptions['block'].length > 0) {
            self.sendMessage({ op: 'ping_block' });
            self.sendMessage({ op: 'blocks_sub' });
          }

          // re-subscribe new transactions when reconnecting
          if (self.subscriptions['utx'].length > 0) {
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

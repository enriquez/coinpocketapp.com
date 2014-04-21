(function(BlockChainInfo, BitcoinNetwork, Models) {

  function BlockHeight() {
    var self = this;
    self.height = 0;

    self._triggerNewBlock = function(height) {
      if (self.height !== height) {
        self.height = height;
        self.trigger('blockHeight.updated', self.height);
      }
    };

    self.socket = new BlockChainInfo.WebSocket();
    self.socket.onNewBlock(function(data) {
      var newHeight = parseInt(data.x.height, 10);
      self._triggerNewBlock(newHeight);
    });
  }

  BlockHeight.prototype.beginPolling = function() {
    var self = this;

    // the socket doesn't always notify us, so we'll poll for it every 15 seconds :(
    // it doesn't always give us the latest block height either :(
    self.socket.onConnectSuccess(function() {
      self.socket.pingBlock();
      setInterval(function() {
        self.socket.pingBlock();
      }, 15000);
    });

    self.socket.onReconnectFailure(function() {
      BitcoinNetwork.currentBlockHeight(function(height) {
        self._triggerNewBlock(height);
      });

      setInterval(function() {
        BitcoinNetwork.currentBlockHeight(function(height) {
          self._triggerNewBlock(height);
        });
      }, 60000);
    });

  };

  MicroEvent.mixin(BlockHeight);
  Models.blockHeight = new BlockHeight();
})(BlockChainInfo, BitcoinNetwork, CoinPocketApp.Models);

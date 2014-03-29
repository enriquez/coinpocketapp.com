(function(BlockChainInfo, Models) {

  function BlockHeight() {
    var self = this;
    self.height = 0;

    self.socket = new BlockChainInfo.WebSocket();
    self.socket.onNewBlock(function(data) {
      self.height = parseInt(data.x.height, 10);
      self.trigger('blockHeight.updated', self.height, data.x.txIndexes);
    });
  }

  MicroEvent.mixin(BlockHeight);
  Models.blockHeight = new BlockHeight();
})(BlockChainInfo, CoinPocketApp.Models);

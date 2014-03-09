(function(BlockChainInfo, Models) {

  function BlockHeight() {
    this.height = 0;
  }

  BlockHeight.prototype.fetchHeight = function(hollaback) {
    var self = this;
    BlockChainInfo.latestblock(function(json) {
      self.height = json.height;
      if (typeof hollaback === 'function') {
        hollaback(self.height);
      }
      self.trigger('blockHeight.updated', self.height);
    });
  };

  MicroEvent.mixin(BlockHeight);
  Models.blockHeight = new BlockHeight();
})(BlockChainInfo, CoinPocketApp.Models);

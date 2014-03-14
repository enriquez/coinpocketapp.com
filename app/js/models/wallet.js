(function(BlockChainInfo, Models) {

  function Wallet() {
    this.unspentOutputs = {};
  }

  Wallet.prototype.updateUnspentOutputs = function(unspentOutputs) {
    for (var i=0; i<unspentOutputs.length; i++) {
      var unspentOutput = unspentOutputs[i];
      var id = unspentOutput.tx_hash + '-' + unspentOutput.tx_output_n;

      this.unspentOutputs[id] = {
        tx_hash: unspentOutput.tx_hash,
        tx_output_n: unspentOutput.tx_output_n,
        script: unspentOutput.script,
        value: unspentOutput.value,
        confirmations: unspentOutput.confirmations
      };
    }
  };

  Wallet.prototype.fetchUnspentOutputs = function(address, hollaback) {
    var self = this;
    BlockChainInfo.unspent(address, function(data) {
      var result = [];
      if (data.unspent_outputs && data.unspent_outputs.length > 0) {
        result = data.unspent_outputs;
        self.unspentOutputs = {};
        self.updateUnspentOutputs(result);
      }

      hollaback(result);
    });
  };

  Wallet.prototype.balanceBTC = function() {
    var value = 0;
    for (var id in this.unspentOutputs) {
      var unspentOutput = this.unspentOutputs[id];
      if (unspentOutput.confirmations > 0) {
        value += unspentOutput.value;
      }
    }

    return value / 100000000;
  };

  Models.Wallet = Wallet;
  Models.wallet = new Wallet();
})(BlockChainInfo, CoinPocketApp.Models);

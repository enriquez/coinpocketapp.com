(function(BlockChainInfo, Models) {

  function Wallet() {
    this.unspentOutputs = {};
  }

  Wallet.prototype.updateUnspentOutputs = function(unspentOutputs) {
    for (var i=0; i<unspentOutputs.length; i++) {
      var unspentOutput = unspentOutputs[i];
      var id = unspentOutput.tx_hash + '-' + unspentOutput.tx_output_n;

      if (unspentOutput.confirmations > 0) {
        this.unspentOutputs[id] = {
          tx_hash: unspentOutput.tx_hash,
          tx_output_n: unspentOutput.tx_output_n,
          script: unspentOutput.script,
          value: unspentOutput.value,
          confirmations: unspentOutput.confirmations
        };
      }
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
      value += unspentOutput.value;
    }

    return value / 100000000;
  };

  Wallet.prototype.selectCoins = function(opts) {
    var totalRequested = opts.amountBTC + opts.minerFeeBTC,
        totalAvailable = this.balanceBTC(),
        selectedCoins = [];

    if (totalRequested <= totalAvailable) {
      // return the only output
      if (Object.keys(this.unspentOutputs).length === 1) {
        selectedCoins.push(this.unspentOutputs[Object.keys(this.unspentOutputs)[0]]);
        return selectedCoins;
      }

      // look for an output that has the exact amount
      for (var id in this.unspentOutputs) {
        var unspentOutput = this.unspentOutputs[id];
        if (totalRequested === unspentOutput.value / 100000000) {
          selectedCoins.push(unspentOutput);
          return selectedCoins;
        }
      }

      // collect outputs until requested amount is matched or exceeded
      var totalOutputValue = 0;
      for (var id in this.unspentOutputs) {
        var unspentOutput = this.unspentOutputs[id];
        selectedCoins.push(unspentOutput);
        totalOutputValue += unspentOutput.value / 100000000;

        if (totalRequested <= totalOutputValue) {
          return selectedCoins;
        }
      }

    }

    return selectedCoins;
  };

  Models.Wallet = Wallet;
  Models.wallet = new Wallet();
})(BlockChainInfo, CoinPocketApp.Models);

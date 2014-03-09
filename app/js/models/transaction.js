(function(BlockChainInfo, Models) {

  function Transaction(attrs) {
    var self = this;

    self.time = attrs.time;
    self.amountDelta = attrs.amountDelta;
    self.blockHeight = attrs.blockHeight;
  }

  Transaction.prototype.confirmations = function(currentBlockHeight) {
    var confirmations = currentBlockHeight - this.blockHeight + 1;

    if (confirmations > 0) { // positive
      return confirmations;
    } else { // negative or NaN
      return 0;
    }
  };

  var transactions = [];

  transactions.fetchRecent = function(address, hollaback) {
    BlockChainInfo.rawaddr(address, function(data) {
      var txsData = data.txs || [],
          recentTransactions = [];

      for (var i=0; i<txsData.length; i++) {
        var txData = txsData[i],
            attrs  = {};

        attrs.time = txData.time;
        attrs.blockHeight = txData.block_height;
        attrs.amountDelta = 0;

        // add credits
        for (var j=0; j<txData.out.length; j++) {
          var output = txData.out[j];
          if (output.addr === address) {
            attrs.amountDelta += parseInt(output.value);
          }
        }

        // subtract debits
        for (var k=0; k<txData.inputs.length; k++) {
          var input = txData.inputs[k].prev_out;
          if (input.addr === address) {
            attrs.amountDelta -= parseInt(input.value);
          }
        }

        var transaction = new Transaction(attrs);

        recentTransactions.push(transaction);
      }

      hollaback(recentTransactions);
    });
  };

  Models.transactions = transactions;
  Models.Transaction = Transaction;

})(BlockChainInfo, CoinPocketApp.Models);

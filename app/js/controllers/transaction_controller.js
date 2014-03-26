(function(blockHeight, transactions, keyPair, transactionsView, Controllers) {

  function TransactionController() {
    var self = this;

    var updateTransactions = function(newTransactions) {
      for (var i = 0; i < newTransactions.length; i++) {
        var transaction = newTransactions[i];
        transactionsView.insertTransaction(transaction);
      }
    };

    if (blockHeight.height > 0) {
      transactionsView.updateBlockHeight(blockHeight.height);
    }

    blockHeight.bind('blockHeight.updated', function(height, txIds) {
      transactionsView.updateBlockHeight(height);
      for (var i = 0; i < txIds.length; i++) {
        transactionsView.transactionConfirmed(txIds[i], height);
      }
    });

    if (keyPair.isGenerated) {
      transactions.fetchRecent(keyPair.bitcoinAddress, updateTransactions);
      transactions.onNewTransaction(keyPair.bitcoinAddress, updateTransactions);
    } else {
      keyPair.bind('keyPair.generate', function() {
        transactions.fetchRecent(keyPair.bitcoinAddress, updateTransactions);
        transactions.onNewTransaction(keyPair.bitcoinAddress, updateTransactions);
      });
    }
  }

  Controllers.TransactionController = new TransactionController();

})(CoinPocketApp.Models.blockHeight, CoinPocketApp.Models.transactions, CoinPocketApp.Models.keyPair, CoinPocketApp.Views.transactionsView, CoinPocketApp.Controllers);

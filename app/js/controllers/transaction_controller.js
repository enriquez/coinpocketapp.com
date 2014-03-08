(function(transactions, keyPair, transactionsView, Controllers) {

  function TransactionController() {
    var self = this;

    var updateTransactions = function(newTransactions) {
      for (var i = 0; i < newTransactions.length; i++) {
        var transaction = newTransactions[i];
        transactionsView.insertNewTransaction(transaction);
      }
    }

    if (keyPair.isGenerated) {
      transactions.fetchRecent(keyPair.bitcoinAddress, updateTransactions);
    } else {
      keyPair.bind('keyPair.generate', function() {
        transactions.fetchRecent(keyPair.bitcoinAddress, updateTransactions);
      });
    }
  };

  Controllers.TransactionController = new TransactionController();

})(CoinPocketApp.Models.transactions, CoinPocketApp.Models.keyPair, CoinPocketApp.Views.transactionsView, CoinPocketApp.Controllers);

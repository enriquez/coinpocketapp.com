(function(blockHeight, transactions, keyPair, conversionRate, transactionsView, Controllers) {

  function TransactionController() {
    var self = this;

    var updateTransactions = function(newTransactions) {
      for (var i = 0; i < newTransactions.length; i++) {
        var transaction = newTransactions[i];
        transactionsView.insertTransaction(transaction);
      }

      var current = conversionRate.current();
      transactionsView.setUnits(current.rate, current.units);

      if (transactionsView.visibleTransactionCount() < transactions.totalCount) {
        transactionsView.showLoadMore();
      } else {
        transactionsView.hideLoadMore();
      }
    };

    transactionsView.bind('loadButton.clicked', function() {
      transactionsView.loadMoreLoading();
      transactions.fetchRecent(keyPair.bitcoinAddress, transactionsView.visibleTransactionCount(), function(newTxs) {
        transactionsView.loadMoreDoneLoading();
        updateTransactions(newTxs);
      });
    });

    blockHeight.bind('blockHeight.updated', function(height) {
      transactionsView.updateBlockHeight(height);
      transactions.fetchRecent(keyPair.bitcoinAddress, 0, updateTransactions);
    });

    if (keyPair.isGenerated) {
      transactions.onNewTransaction(keyPair.bitcoinAddress, function() {
        transactions.fetchRecent(keyPair.bitcoinAddress, 0, updateTransactions);
      });
    } else {
      keyPair.bind('keyPair.generate', function() {
        transactions.onNewTransaction(keyPair.bitcoinAddress, function() {
          transactions.fetchRecent(keyPair.bitcoinAddress, 0, updateTransactions);
        });
      });
    }

    conversionRate.bind('selectedRateSource.updated', function(rate) {
      var current = conversionRate.current();
      transactionsView.setUnits(current.rate, current.units);
    });

    conversionRate.bind('selectedUnits.updated', function(selectedUnit) {
      var current = conversionRate.current();
      transactionsView.setUnits(current.rate, current.units);
    });
  }

  Controllers.TransactionController = new TransactionController();

})(CoinPocketApp.Models.blockHeight, CoinPocketApp.Models.transactions, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.conversionRate, CoinPocketApp.Views.transactionsView, CoinPocketApp.Controllers);

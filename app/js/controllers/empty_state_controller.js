(function(transactions, keyPair, emptyStateView, Controllers) {

  function EmptyStateController() {
    if (transactions.any()) {
      emptyStateView.hide();
    } else {
      transactions.bind("transactions.updated", function() {
        emptyStateView.hide();
      });
    }

    if (keyPair.isGenerated) {
      emptyStateView.setReceiveAddress(keyPair.bitcoinAddress);
    } else {
      keyPair.bind('keyPair.generate', function() {
        emptyStateView.setReceiveAddress(keyPair.bitcoinAddress);
      });
    }
  }

  Controllers.emptyStateController = new EmptyStateController();

})(CoinPocketApp.Models.transactions, CoinPocketApp.Models.keyPair, CoinPocketApp.Views.emptyStateView, CoinPocketApp.Controllers);

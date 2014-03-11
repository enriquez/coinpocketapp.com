(function(transactions, emptyStateView, Controllers) {

  function EmptyStateController() {
    if (transactions.any()) {
      emptyStateView.hide();
    } else {
      transactions.bind("transactions.updated", function() {
        emptyStateView.hide();
      });
    }
  }

  Controllers.emptyStateController = new EmptyStateController();

})(CoinPocketApp.Models.transactions, CoinPocketApp.Views.emptyStateView, CoinPocketApp.Controllers);

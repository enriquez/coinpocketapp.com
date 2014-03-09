(function(blockHeight, transactionsView, Controllers) {

  function BlockHeightController() {
    blockHeight.bind('blockHeight.updated', function(height) {
      transactionsView.updateBlockHeight(height);
    });
    blockHeight.fetchHeight();
  }

  Controllers.blockHeightController = new BlockHeightController();

})(CoinPocketApp.Models.blockHeight, CoinPocketApp.Views.transactionsView, CoinPocketApp.Controllers);

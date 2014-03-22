(function(wallet, keyPair, blockHeight, balanceView, Controllers) {

  function BalanceController() {
    if (keyPair.isGenerated) {
      blockHeight.bind('blockHeight.updated', function(height) {
        wallet.fetchUnspentOutputs(keyPair.bitcoinAddress);
      });
    } else {
      keyPair.bind('keyPair.generate', function() {
        wallet.fetchUnspentOutputs(keyPair.bitcoinAddress);
        blockHeight.bind('blockHeight.updated', function(height) {
          wallet.fetchUnspentOutputs(keyPair.bitcoinAddress);
        });
      });
    }

    wallet.bind('unspentOutputs.updated', function(data) {
      balanceView.setBalance(wallet.balanceBTC());
    });
  }

  Controllers.balanceController = new BalanceController();

})(CoinPocketApp.Models.wallet, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.blockHeight, CoinPocketApp.Views.balanceView, CoinPocketApp.Controllers);

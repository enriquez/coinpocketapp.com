(function(wallet, keyPair, blockHeight, balanceView, Controllers) {

  function BalanceController() {
    if (keyPair.isGenerated) {
      blockHeight.bind('blockHeight.updated', function(height) {
        wallet.fetchUnspentOutputs(keyPair.bitcoinAddress, function(data) {
          balanceView.setBalance(wallet.balanceBTC());
        });
      });
    } else {
      keyPair.bind('keyPair.generate', function() {
        wallet.fetchUnspentOutputs(keyPair.bitcoinAddress, function(data) {
          balanceView.setBalance(wallet.balanceBTC());
        });
        blockHeight.bind('blockHeight.updated', function(height) {
          wallet.fetchUnspentOutputs(keyPair.bitcoinAddress, function(data) {
            balanceView.setBalance(wallet.balanceBTC());
          });
        });
      });
    }
  }

  Controllers.balanceController = new BalanceController();

})(CoinPocketApp.Models.wallet, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.blockHeight, CoinPocketApp.Views.balanceView, CoinPocketApp.Controllers);

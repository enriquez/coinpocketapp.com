(function(wallet, keyPair, blockHeight, conversionRate, balanceView, Controllers) {

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

    conversionRate.bind('selectedRateSource.updated', function(rate) {
      var current = conversionRate.current();
      balanceView.setUnits(current.rate, current.units);
    });

    conversionRate.bind('selectedUnits.updated', function(selectedUnit) {
      var current = conversionRate.current();
      balanceView.setUnits(current.rate, current.units);
    });

    balanceView.bind('balance.clicked', function() {
      conversionRate.toggleSelectedUnits();
    });
  }

  Controllers.balanceController = new BalanceController();

})(CoinPocketApp.Models.wallet, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.blockHeight, CoinPocketApp.Models.conversionRate, CoinPocketApp.Views.balanceView, CoinPocketApp.Controllers);

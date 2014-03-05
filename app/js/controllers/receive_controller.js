(function(CoinPocketApp) {

  var self = CoinPocketApp.Controllers.ReceiveController = {
    view: CoinPocketApp.Views.receiveView
  };

  if (CoinPocketApp.Models.keyPair.isGenerated) {
    self.view.setAddress(CoinPocketApp.Models.KeyPair.keyPair.bitcoinAddress);
  } else {
    CoinPocketApp.Models.keyPair.bind("keyPair.generate", function(keyPair) {
      self.view.setAddress(keyPair.bitcoinAddress);
    });
  }

})(CoinPocketApp);

(function(CoinPocketApp) {

  var self = CoinPocketApp.Controllers.ReceiveController = {
    view: CoinPocketApp.Views.receiveView
  };

  if (CoinPocketApp.Models.KeyPair.hasKeyPair()) {
    self.view.setAddress(CoinPocketApp.Models.KeyPair.keyPair.bitcoinAddress);
  } else {
    CoinPocketApp.events.bind("KeyPair.generate", function(keyPair) {
      self.view.setAddress(keyPair.bitcoinAddress);
    });
  }

})(CoinPocketApp);

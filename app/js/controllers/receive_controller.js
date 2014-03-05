(function(CoinPocketApp) {

  var self = CoinPocketApp.Controllers.ReceiveController = {
    view: new CoinPocketApp.Views.ReceiveView()
  };

  if (CoinPocketApp.Models.KeyPair.hasKeyPair()) {
    self.view.setAddress(CoinPocketApp.Models.KeyPair.keyPair.bitcoinAddress);
  } else {
    CoinPocketApp.events.bind("KeyPair.generate", function(keyPair) {
      self.view.setAddress(keyPair.bitcoinAddress);
    });
  }

})(CoinPocketApp);

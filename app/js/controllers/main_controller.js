(function(CoinPocketApp) {

  if (!CoinPocketApp.Models.KeyPair.hasKeyPair()) {

    var self = CoinPocketApp.Controllers.MainController = {
      view: new CoinPocketApp.Views.MainView()
    };

    self.view.hide();

    CoinPocketApp.events.bind('KeyPair.generate', function() {
      self.view.show();
    });

  }

})(CoinPocketApp);

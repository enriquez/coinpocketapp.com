(function(CoinPocketApp) {

  if (!CoinPocketApp.Models.keyPair.isGenerated) {

    var self = CoinPocketApp.Controllers.MainController = {
      view: CoinPocketApp.Views.mainView
    };

    self.view.hide();

    CoinPocketApp.Models.keyPair.bind('keyPair.generate', function() {
      self.view.show();
    });

  }

})(CoinPocketApp);

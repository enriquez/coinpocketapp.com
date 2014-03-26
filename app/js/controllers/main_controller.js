(function(keyPair, mainView, Controllers) {

  function MainController() {
    if (keyPair.isGenerated) {
      mainView.show();
    } else {
      mainView.hide();
      keyPair.bind('keyPair.generate', function() {
        mainView.show();
      });
    }
  }

  Controllers.mainController = new MainController();

})(CoinPocketApp.Models.keyPair, CoinPocketApp.Views.mainView, CoinPocketApp.Controllers);

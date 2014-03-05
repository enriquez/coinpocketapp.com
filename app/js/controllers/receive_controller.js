(function(keyPair, pageHash, receiveView, Controllers) {

  function ReceiveController() {
    if (keyPair.isGenerated) {
      this.setAddress(keyPair);
    } else {
      keyPair.bind('keyPair.generate', this.setAddress);
    }

    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);
  }

  ReceiveController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/receive') {
      receiveView.show();
    } else {
      receiveView.hide();
    }
  };

  ReceiveController.prototype.setAddress = function(keyPair) {
    receiveView.setAddress(keyPair.bitcoinAddress);
  };

  Controllers.receiveController = new ReceiveController();

})(CoinPocketApp.Models.keyPair, CoinPocketApp.Models.pageHash, CoinPocketApp.Views.receiveView, CoinPocketApp.Controllers);

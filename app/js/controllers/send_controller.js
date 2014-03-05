(function(pageHash, bitcoinWorker, sendView, Controllers) {

  function SendController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);
  }

  SendController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/send') {
      sendView.show();

      bitcoinWorker.async("parseCode", [pageParams.params.code], function(result) {
        if (result.address) {
          sendView.setAddress(result.address);
        } else {
          sendView.setAddress('');
        }

        if (result.amount) {
          sendView.setAmount(result.amount);
        } else {
          sendView.setAmount('');
        }
      });
    } else {
      sendView.hide();
      sendView.setAddress('');
      sendView.setAmount('');
    }
  };

  Controllers.sendController = new SendController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Views.sendView, CoinPocketApp.Controllers);

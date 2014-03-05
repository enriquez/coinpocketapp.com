(function(pageHash, bitcoinWorker, sendView, Controllers) {

  function SendController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);
  }

  SendController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/send') {
      sendView.show();

      console.log(pageParams);
      bitcoinWorker.async("parseCode", [pageParams.params.code], function(result) {
        console.log(result);
        if (result.address) {
          sendView.setAddress(result.address);
        }

        if (result.amount) {
          sendView.setAmount(result.amount);
        }
      });
    } else {
      sendView.hide();
    }
  };

  Controllers.sendController = new SendController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Views.sendView, CoinPocketApp.Controllers);

(function(pageHash, sendView, Controllers) {

  function SendController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);
  }

  SendController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/send') {
      sendView.show();
    } else {
      sendView.hide();
    }
  };

  Controllers.sendController = new SendController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Views.sendView, CoinPocketApp.Controllers);

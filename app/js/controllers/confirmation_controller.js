(function(pageHash, confirmationView, Controllers) {

  function ConfirmationController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);
  }

  ConfirmationController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/confirmation') {
      confirmationView.show();
    } else {
      confirmationView.hide();
    }
  };

  Controllers.confirmationController = new ConfirmationController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Views.confirmationView, CoinPocketApp.Controllers);

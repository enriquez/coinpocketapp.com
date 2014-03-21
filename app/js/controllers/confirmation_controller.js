(function(pageHash, wallet, confirmationView, Controllers) {

  function ConfirmationController() {
    var self = this;

    self.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', self.showOrHide);
    confirmationView.bind('sendButton.click', self.sendButtonClicked.bind(self));
  }

  ConfirmationController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/confirmation') {
      confirmationView.show();
    } else {
      confirmationView.hide();
    }
  };

  ConfirmationController.prototype.confirmTransaction = function(transaction) {
    this.transaction = transaction;
    pageHash.goTo("#/confirmation");
  };

  ConfirmationController.prototype.sendButtonClicked = function($form) {
    var password = confirmationView.$passwordInput.val();
    //TODO: show loading
    wallet.sendTransaction(password, this.transaction, function(success) {
      if (success) {
        console.log('sent!');
      } else {
        console.log('failed');
      }
    });
  };

  Controllers.confirmationController = new ConfirmationController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.wallet, CoinPocketApp.Views.confirmationView, CoinPocketApp.Controllers);

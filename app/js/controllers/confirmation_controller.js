(function(pageHash, keyPair, wallet, confirmationView, Controllers) {

  function ConfirmationController() {
    var self = this;

    self.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', self.showOrHide.bind(self));
    confirmationView.bind('sendButton.click', self.sendButtonClicked.bind(self));
  }

  ConfirmationController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/confirmation') {
      if (this.transaction) {
        confirmationView.show();
      } else {
        pageHash.goTo("#/");
      }
    } else {
      confirmationView.hide();
    }
  };

  ConfirmationController.prototype.confirmTransaction = function(transaction) {
    this.transaction = transaction;
    pageHash.goTo("#/confirmation");
  };

  ConfirmationController.prototype.sendButtonClicked = function($form) {
    var self = this;
    var password = confirmationView.$passwordInput.val();
    confirmationView.loading();
    wallet.sendTransaction(password, self.transaction, function(success, errorMessage) {
      if (success) {
        wallet.fetchUnspentOutputs(keyPair.bitcoinAddress, function() {
          pageHash.goTo("#/");
          self.transaction = null;
        });
      } else {
        confirmationView.validationMessage(errorMessage);
        confirmationView.doneLoading();
      }
    });
  };

  Controllers.confirmationController = new ConfirmationController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.wallet, CoinPocketApp.Views.confirmationView, CoinPocketApp.Controllers);

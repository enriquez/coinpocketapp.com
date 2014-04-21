(function(pageHash, keyPair, wallet, conversionRate, transactions, confirmationView, Controllers) {

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
    confirmationView.setTransaction(this.transaction, keyPair.bitcoinAddress, conversionRate.selectedRate());
    pageHash.goTo("#/confirmation");
  };

  ConfirmationController.prototype.sendButtonClicked = function($form) {
    var self = this;
    var password = confirmationView.$passwordInput.val();
    confirmationView.loading();
    wallet.sendTransaction(password, self.transaction, function(success, errorMessage) {
      if (success) {
        // sending a transaction doesn't always trigger blockchain.info's socket to notify us of the transaction.
        // we manually refresh the transactions after sending in case we didn't get the notification.
        transactions.fetchRecent(keyPair.bitcoinAddress, 0, function(transactions) {
          pageHash.goTo("#/");
          self.transaction = null;
        });
        wallet.fetchUnspentOutputs(keyPair.bitcoinAddress, function() { });
      } else {
        confirmationView.validationMessage(errorMessage);
        confirmationView.doneLoading();
      }
    });
  };

  Controllers.confirmationController = new ConfirmationController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.wallet, CoinPocketApp.Models.conversionRate, CoinPocketApp.Models.transactions, CoinPocketApp.Views.confirmationView, CoinPocketApp.Controllers);

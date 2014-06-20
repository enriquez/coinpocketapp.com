(function(pageHash, keyPair, conversionRate, transactions, mainWallet, sweepConfirmView, Controllers) {

  function SweepConfirmController() {
    var self = this;

    self.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', self.showOrHide.bind(self));

    sweepConfirmView.bind('sweepButton.click', function() {
      if (self.wallet && self.privateKey && self.transaction) {
        sweepConfirmView.loadingButton();
        self.wallet.sendTransactionWithPrivateKey(self.privateKey._data, self.transaction, function(success, errorMessage) {
          if (success) {
            transactions.fetchRecent(keyPair.bitcoinAddress, 0, function(transactions) {
              pageHash.goTo("#/");
              self.transaction = null;
              self.wallet = null;
              self.privateKey = null;
            });
            mainWallet.fetchUnspentOutputs(keyPair.bitcoinAddress, function() { });
          } else {
            sweepConfirmView.validationMessage(errorMessage);
            sweepConfirmView.doneLoading();
          }
        });
      } else {
        pageHash.goTo("#/");
      }
    });
  }

  SweepConfirmController.prototype.showOrHide = function(pageParams) {
    var self = this;

    if (pageParams.page === '#/sweep_confirm') {
      if (self.privateKey) {
        sweepConfirmView.loading();
        sweepConfirmView.show();

        self.wallet = new CoinPocketApp.Models.Wallet({ allowUnconfirmed: true });

        self.privateKey.address(function(address) {
          self.wallet.fetchUnspentOutputs(address, function(unspents) {
            self.privateKey.wif(function(wif) {
              balance = self.wallet.balanceBTC();
              sweepConfirmView.setAddress(address);
              sweepConfirmView.setWIF(wif);

              if (keyPair.bitcoinAddress === address) {
                sweepConfirmView.setBalance(balance);
                sweepConfirmView.doneLoading();
                sweepConfirmView.showError("Can't sweep balance from your own private key");
              } else if (unspents.error) {
                sweepConfirmView.setBalance();
                sweepConfirmView.doneLoading();
                sweepConfirmView.showError('Unable to download balance');
              } else if (balance > 0) {
                self.wallet.sweepTransaction(keyPair.bitcoinAddress, function(transaction) {
                  self.transaction = transaction;
                  sweepConfirmView.setBalance(balance);
                  sweepConfirmView.setTransaction(transaction, conversionRate.selectedRate());
                  sweepConfirmView.doneLoading();
                  sweepConfirmView.showSuccess();
                });
              } else {
                sweepConfirmView.setBalance(balance);
                sweepConfirmView.doneLoading();
                sweepConfirmView.showEmpty();
              }
            });
          });
        });
      } else {
        pageHash.goTo("#/");
      }
    } else {
      sweepConfirmView.hide();
    }
  };

  SweepConfirmController.prototype.confirmSweep = function(privateKey) {
    this.privateKey = privateKey;
    pageHash.goTo("#/sweep_confirm");
  };

  Controllers.sweepConfirmController = new SweepConfirmController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.conversionRate, CoinPocketApp.Models.transactions, CoinPocketApp.Models.wallet, CoinPocketApp.Views.sweepConfirmView, CoinPocketApp.Controllers);

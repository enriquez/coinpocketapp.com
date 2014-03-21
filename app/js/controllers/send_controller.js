(function(pageHash, keyPair, wallet, bitcoinWorker, sendView, confirmationController, Controllers) {

  function SendController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);
    sendView.bind('nextButton.click', this.nextButtonClicked);
  }

  SendController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/send') {
      sendView.show();

      if (pageParams.params.code) {
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
      }
    } else if (pageParams.page === '#/confirmation') {
      sendView.hide();
      sendView.clearValidations();
    } else {
      sendView.hide();
      sendView.clearValidations();
      sendView.setAddress('');
      sendView.setAmount('');
      sendView.setTransactionFee('');
    }
  };

  SendController.prototype.nextButtonClicked = function() {
    var self = this;

    var addressValue = sendView.$address.val(),
        amountValue  = sendView.$amount.val(),
        transactionFeeValue = sendView.$transactionFee.val();

    sendView.clearValidations();

    wallet.buildTransaction(keyPair.bitcoinAddress, {
      address: addressValue,
      amount: amountValue,
      transactionFee: transactionFeeValue
    }, function(transaction) {
      if (transaction.isValid) {
        confirmationController.confirmTransaction(transaction);
      } else if (transaction.errorForAddress) {
        sendView.validationMessage(transaction.errorForAddress);
        sendView.invalidAddressInput();
      } else if (transaction.errorForAmount) {
        sendView.validationMessage(transaction.errorForAmount);
        sendView.invalidAmountInput();
      } else if (transaction.errorForTransactionFee) {
        sendView.validationMessage(transaction.errorForTransactionFee);
        sendView.invalidTransactionFeeInput();
      } else {
        sendView.validationMessage(transaction.errorMessage);
      }
    });
  };

  Controllers.sendController = new SendController();

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.wallet, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Views.sendView, CoinPocketApp.Controllers.confirmationController, CoinPocketApp.Controllers);

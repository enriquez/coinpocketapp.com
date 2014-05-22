(function(pageHash, keyPair, wallet, bitcoinWorker, browser, conversionRate, sendView, confirmationController, Controllers) {

  function SendController() {
    var self = this;
    self.amountBTC = 0;
    self.amountUnits = 'btc';
    sendView.setAmountUnitsToBTC();

    self.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', self.showOrHide.bind(this));
    sendView.bind('nextButton.click', self.nextButtonClicked.bind(this));

    if (browser.canScanCode()) {
      sendView.showScanCode();
    } else {
      sendView.hideScanCode();
    }

    function calculateBTCtoUSD(btc) {
      var rate = conversionRate.selectedRate();
      return (parseFloat(btc) * rate).toFixed(2);
    }

    function calculateUSDtoBTC(usd) {
      var rate = conversionRate.selectedRate();
      return parseFloat((parseFloat(usd) / parseFloat(rate)).toFixed(8));
    }

    sendView.bind('switchUnitsButton.click', function() {
      if (self.amountUnits === 'btc') {
        self.amountUnits = 'usd';
        sendView.setAmountUnitsToUSD();
        sendView.setConversion(parseFloat(self.amountBTC) + ' BTC');
        if (self.amountBTC > 0) {
          sendView.setAmount(calculateBTCtoUSD(self.amountBTC));
        } else {
          sendView.setAmount('');
        }
      } else {
        self.amountUnits = 'btc';
        sendView.setAmountUnitsToBTC();
        sendView.setConversion('$' + calculateBTCtoUSD(self.amountBTC) + ' USD');
        if (self.amountBTC > 0) {
          sendView.setAmount(parseFloat(self.amountBTC));
        } else {
          sendView.setAmount('');
        }
      }
    });

    sendView.bind('amount.changed', function(val) {
      if (self.amountUnits === 'btc') {
        if (val && !/\D$/.test(val)) {
          self.amountBTC = val;
          sendView.setConversion('$' + calculateBTCtoUSD(val) + ' USD');
        } else {
          self.amountBTC = 0;
          sendView.setConversion('$0.00 USD');
        }
      } else {
        if (val && !/\D$/.test(val)) {
          self.amountBTC = calculateUSDtoBTC(val);
          sendView.setConversion(self.amountBTC + ' BTC');
        } else {
          self.amountBTC = 0;
          sendView.setConversion('0 BTC');
        }
      }
    });
  }

  SendController.prototype.showOrHide = function(pageParams) {
    var self = this;
    if (pageParams.page === '#/send') {
      sendView.show();

      if (pageParams.params.code) {
        bitcoinWorker.asyncNewThread("parseCode", [pageParams.params.code], function(result) {
          if (result.address) {
            sendView.setAddress(result.address);
          }

          if (result.amount) {
            self.amountUnits = 'btc';
            sendView.setConversion('$0.00 USD');
            sendView.setAmountUnitsToBTC();
            sendView.setAmount(result.amount);
          }

          if (result.address && result.amount) {
            self.nextButtonClicked();
          } else {
            pageHash.goTo("#/send"); // clear qr code data from url
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
      sendView.setConversion('$0.00 USD');
      sendView.setAmountUnitsToBTC();
      sendView.setTransactionFee('');
      this.amountBTC = 0;
      this.amountUnits = 'btc';
    }
  };

  SendController.prototype.nextButtonClicked = function() {
    var self = this;

    var addressValue = sendView.$address.val(),
        amountValue  = self.amountBTC,
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

})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.wallet, CoinPocketApp.Models.bitcoinWorker, CoinPocketApp.Models.browser, CoinPocketApp.Models.conversionRate, CoinPocketApp.Views.sendView, CoinPocketApp.Controllers.confirmationController, CoinPocketApp.Controllers);

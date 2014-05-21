(function($, Views) {

  function SweepConfirmView() {
    var self = this;

    self.$container = $("#sweep-confirm");
    self.$container.find('.toggle-panel').panelToggle();
    self.$sweepButton = $("#sweep-confirm-button");
    self.$sweepSuccess = $("#sweep-success");
    self.$summaryBTC = $("#sweep-confirm-summary-btc");
    self.$summaryUSD = $("#sweep-confirm-summary-usd");
    self.$sweepEmpty = $("#sweep-empty");
    self.$sweepError = $("#sweep-error");
    self.$validation = $("#sweep-validation-message");
    self.$spinner    = self.$container.find(".spinner-container");

    self.$sweepButton.click(function(e) {
      e.preventDefault();
      self.trigger('sweepButton.click');
    });
  }

  SweepConfirmView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SweepConfirmView.prototype.hide = function() {
    this.$container.hide();
    this.clearValidations();
  };

  SweepConfirmView.prototype.setAddress = function(address) {
    this.$container.find('.sweep-address').text(address);
  };

  SweepConfirmView.prototype.setWIF = function(wif) {
    this.$container.find('.sweep-wif').text(wif);
  };

  SweepConfirmView.prototype.setBalance = function(balance) {
    if (balance || balance === 0) {
      this.$container.find('.sweep-balance').text(balance.toFixed(8) + " BTC");
    } else {
      this.$container.find('.sweep-balance').text('Unknown');
    }
  };

  SweepConfirmView.prototype.setTransaction = function(transaction, conversionRate) {
    function satoshiToBTC(satoshis) {
      return satoshis / 100000000;
    }

    var totalInputValue = 0;
    for (var i=0; i<transaction.inputs.length; i++) {
      var input = transaction.inputs[i];
      totalInputValue += input.value;
    }

    totalInputValue = satoshiToBTC(totalInputValue);

    var totalOutputValue = 0;
    for (var j=0; j<transaction.outputs.length; j++) {
      var output = transaction.outputs[j];

      var address = output.address;
      totalOutputValue += output.amount;
    }

    var minerFee = totalInputValue - totalOutputValue;
    var netTransactionBTC = parseFloat(totalOutputValue.toFixed(8));
    var netTransactionUSD = (netTransactionBTC * parseFloat(conversionRate)).toFixed(2);

    this.$container.find('.sweep-miner-fee').text(minerFee.toFixed(8) + " BTC");
    this.$container.find('.sweep-total-btc').text(netTransactionBTC.toFixed(8) + " BTC");
    this.$container.find('.sweep-total-usd').text('~ ' + netTransactionUSD + ' USD');

    this.$summaryBTC.text(netTransactionBTC + ' BTC');
    this.$summaryUSD.text('$' + netTransactionUSD);
  };

  SweepConfirmView.prototype.showSuccess = function() {
    this.$sweepSuccess.show();
    this.$sweepEmpty.hide();
    this.$sweepError.hide();
    this.$sweepButton.text('Sweep');
  };

  SweepConfirmView.prototype.showEmpty = function() {
    this.$sweepSuccess.hide();
    this.$sweepEmpty.show();
    this.$sweepError.hide();
    this.$sweepButton.text('Done');
  };

  SweepConfirmView.prototype.showError = function() {
    this.$sweepSuccess.hide();
    this.$sweepEmpty.hide();
    this.$sweepError.show();
    this.$sweepButton.text('Done');
  };

  SweepConfirmView.prototype.loading = function() {
    this.$sweepButton.button('loading');
    this.$spinner.show();
    this.$sweepSuccess.hide();
    this.$sweepEmpty.hide();
    this.$sweepError.hide();
    this.clearValidations();
  };

  SweepConfirmView.prototype.doneLoading = function() {
    this.$sweepButton.button('reset');
    this.$spinner.hide();
  };

  SweepConfirmView.prototype.loadingButton = function() {
    this.$sweepButton.button('loading');
    this.clearValidations();
  };

  SweepConfirmView.prototype.validationMessage = function() {
    this.$validation.text(message);
  };

  SweepConfirmView.prototype.clearValidations = function() {
    this.$validation.text('');
  };

  MicroEvent.mixin(SweepConfirmView);
  Views.sweepConfirmView = new SweepConfirmView();
})(jQuery, CoinPocketApp.Views);

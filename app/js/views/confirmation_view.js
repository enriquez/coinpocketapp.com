(function($, Views) {

  function ConfirmationView() {
    var self = this;

    self.$container = $("#confirmation");
    self.$form = $("#confirmation-form");
    self.$passwordInput = $("#confirmation-password");
    self.$sendButton = $("#confirmation-send-button");
    self.$backButton = $("#confirmation-back-button");
    self.$validationMessage = $("#confirmation-validation-message");

    self.$summaryBTC = $("#confirmation-summary-btc");
    self.$transactionSummary = $("#confirmation .panel-body");
    self.$totalInputs = $("#confirmation-total-inputs");
    self.$outputs = $("#confirmation-outputs");
    self.$outputTemplate = $("#confirmation-output-template");
    self.$netTransaction = $("#confirmation-net-transaction-btc");

    self.$sendButton.click(function() {
      self.trigger('sendButton.click', self.$form);
    });

    $(".toggle-panel").click(function(e) {
      e.preventDefault();
      var $panelBody = self.$container.find(".panel-body");
      if ($panelBody.is(':visible')) {
        $panelBody.slideUp();
        $(this).text('show details');
      } else {
        $panelBody.slideDown();
        $(this).text('hide details');
      }
    });
  }

  ConfirmationView.prototype.show = function() {
    this.$container.fadeIn();
  };

  ConfirmationView.prototype.hide = function() {
    this.$container.hide();
    this.clearValidations();
    this.doneLoading();
    this.$passwordInput.val('');
  };

  ConfirmationView.prototype.loading = function() {
    this.$passwordInput.prop('disabled', true);
    this.$sendButton.button('loading');
    this.$backButton.hide();
    this.clearValidations();
  };

  ConfirmationView.prototype.doneLoading = function() {
    this.$passwordInput.prop('disabled', false);
    this.$sendButton.button('reset');
    this.$backButton.show();
  };

  ConfirmationView.prototype.validationMessage = function(message) {
    this.$validationMessage.text(message);
  };

  ConfirmationView.prototype.clearValidations = function() {
    this.$validationMessage.text('');
  };

  ConfirmationView.prototype.setTransaction = function(transaction, changeAddress) {
    function satoshiToBTC(satoshis) {
      return satoshis / 100000000;
    }

    this.$outputs.find(".confirmation-output").remove();

    var totalInputValue = 0;
    for (var i=0; i<transaction.inputs.length; i++) {
      var input = transaction.inputs[i];
      totalInputValue += input.value;
    }

    totalInputValue = satoshiToBTC(totalInputValue);

    var totalOutputValue = 0;
    var changeAmount = 0;
    for (var j=0; j<transaction.outputs.length; j++) {
      var output = transaction.outputs[j];
      var $output = this.$outputTemplate.clone();

      var address = output.address;
      if (address === changeAddress) {
        address = "Change";
        changeAmount = output.amount;
      }
      $output.attr('id', '');
      $output.addClass('confirmation-output');
      $output.find('.confirmation-output-label').text(address);
      $output.find('.confirmation-output-amount').text(output.amount.toFixed(8) + " BTC");

      this.$outputs.append($output);
      $output.show();

      totalOutputValue += output.amount;
    }

    var minerFee = totalInputValue - totalOutputValue;
    if (minerFee > 0) {
      var $minerFee = this.$outputTemplate.clone();
      $minerFee.attr('id', '');
      $minerFee.addClass('confirmation-output');
      $minerFee.find('.confirmation-output-label').text('Miner Fee');
      $minerFee.find('.confirmation-output-amount').text(minerFee.toFixed(8) + " BTC");
      this.$outputs.append($minerFee);
      $minerFee.show();
    }

    var netTransaction = totalOutputValue - changeAmount + minerFee;
    this.$summaryBTC.text(parseFloat(netTransaction.toFixed(8)) + " BTC");
    this.$netTransaction.text(netTransaction.toFixed(8) + " BTC");
    this.$totalInputs.text(totalInputValue.toFixed(8) + " BTC");
  };

  MicroEvent.mixin(ConfirmationView);

  Views.confirmationView = new ConfirmationView();
})(jQuery, CoinPocketApp.Views);

(function($, Views) {

  function SendView() {
    var self = this;
    self.$container = $("#send");
    self.$address = $("#address");
    self.$amount = $("#amount");
    self.$switchUnitsButton = $("#switch-units");
    self.$conversion = $("#conversion");
    self.$transactionFee = $("#transaction-fee");
    self.$addressGroup = $("#address-group");
    self.$amountGroup = $("#amount-group");
    self.$transactionFeeGroup = $("transaction-fee-group");
    self.$sendButton = $("#next-button");
    self.$validationMessage = $("#send-validation-message");
    self.$scancode = $("#scancode");

    self.$container.find("[data-scancode-callback-path]").scancode();

    $("[data-confirm]").click(function(e) {
      e.preventDefault();
      var message = $(this).data('confirm');
      if (confirm(message)) {
        document.location = $(this).attr('href');
      }
    });

    self.$sendButton.click(function(e) {
      e.preventDefault();
      self.trigger('nextButton.click');
    });

    self.$switchUnitsButton.click(function(e) {
      e.preventDefault();
      self.trigger('switchUnitsButton.click');
    });

    self.$amount.on('input', function() {
      self.trigger('amount.changed', $(this).val());
    });
  }

  SendView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SendView.prototype.hide = function() {
    this.$container.hide();
  };

  SendView.prototype.setAddress = function(address) {
    this.$address.val(address);
  };

  SendView.prototype.setAmount = function(amount) {
    this.$amount.val(amount);
    this.trigger('amount.changed', this.$amount.val());
  };

  SendView.prototype.setTransactionFee = function(amount) {
    this.$transactionFee.val(amount);
  };

  SendView.prototype.clearValidations = function() {
    this.$validationMessage.text('');
    this.$addressGroup.removeClass('has-error');
    this.$amountGroup.removeClass('has-error');
    this.$transactionFeeGroup.removeClass('has-error');
  };

  SendView.prototype.validationMessage = function(message) {
    this.$validationMessage.text(message);
  };

  SendView.prototype.invalidAddressInput = function() {
    this.$addressGroup.addClass('has-error');
  };

  SendView.prototype.invalidAmountInput = function() {
    this.$amountGroup.addClass('has-error');
  };

  SendView.prototype.invalidTransactionFeeInput = function() {
    this.$transactionFeeGroup.addClass('has-error');
  };

  SendView.prototype.showScanCode = function() {
    this.$scancode.show();
  };

  SendView.prototype.hideScanCode = function() {
    this.$scancode.hide();
  };

  SendView.prototype.setConversion = function(text) {
    this.$conversion.text(text);
  };

  SendView.prototype.setAmountUnitsToUSD = function() {
    this.$amountGroup.find('span.input-group-addon').text('USD');
  };

  SendView.prototype.setAmountUnitsToBTC = function() {
    this.$amountGroup.find('span.input-group-addon').text('BTC');
  };

  MicroEvent.mixin(SendView);
  Views.sendView = new SendView();
})(jQuery, CoinPocketApp.Views);

(function($, Views) {

  function SendView() {
    var self = this;
    self.$container = $("#send");
    self.$address = $("#address");
    self.$amount = $("#amount");
    self.$transactionFee = $("#transaction-fee");
    self.$addressGroup = $("#address-group");
    self.$amountGroup = $("#amount-group");
    self.$transactionFeeGroup = $("transaction-fee-group");
    self.$sendButton = $("#next-button");
    self.$validationMessage = $("#send-validation-message");

    $("#scancode-button").scancode();

    self.$sendButton.click(function(e) {
      e.preventDefault();
      self.trigger('nextButton.click');
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

  MicroEvent.mixin(SendView);
  Views.sendView = new SendView();
})(jQuery, CoinPocketApp.Views);

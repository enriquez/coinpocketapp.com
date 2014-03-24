(function($, Views) {

  function ConfirmationView() {
    var self = this;

    self.$container = $("#confirmation");
    self.$form = $("#confirmation-form");
    self.$passwordInput = $("#confirmation-password");
    self.$sendButton = $("#confirmation-send-button");
    self.$backButton = $("#confirmation-back-button");
    self.$validationMessage = $("#confirmation-validation-message");

    self.$sendButton.click(function() {
      self.trigger('sendButton.click', self.$form);
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

  MicroEvent.mixin(ConfirmationView);

  Views.confirmationView = new ConfirmationView();
})(jQuery, CoinPocketApp.Views);

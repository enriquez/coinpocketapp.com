(function($, Views) {

  function PrivateKeyPasswordView() {
    var self = this;
    self.$container = $('#private-key-password');
    self.$passwordInput = $('#private-key-password-input');
    self.$nextButton = $('#private-key-password-next-button');
    self.$validationMessage = $('#private-key-password-validation-message');

    self.$nextButton.click(function(e) {
      e.preventDefault();
      self.trigger('nextButton.click');
    });
  }

  PrivateKeyPasswordView.prototype.show = function() {
    this.$container.fadeIn();
  };

  PrivateKeyPasswordView.prototype.hide = function() {
    this.$container.hide();
    this.$passwordInput.val('');
    this.clearValidations();
    this.doneLoading();
  };

  PrivateKeyPasswordView.prototype.validationMessage = function(message) {
    this.$validationMessage.text(message);
  };

  PrivateKeyPasswordView.prototype.clearValidations = function() {
    this.$validationMessage.text('');
  };

  PrivateKeyPasswordView.prototype.loading = function() {
    this.$passwordInput.prop('disabled', true);
    this.$nextButton.button('loading');
    this.clearValidations();
  };

  PrivateKeyPasswordView.prototype.doneLoading = function() {
    this.$passwordInput.prop('disabled', false);
    this.$nextButton.button('reset');
  };

  MicroEvent.mixin(PrivateKeyPasswordView);
  Views.privateKeyPasswordView = new PrivateKeyPasswordView();
})(jQuery, CoinPocketApp.Views);

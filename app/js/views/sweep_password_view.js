(function($, Views) {

  function SweepPasswordView() {
    var self = this;

    self.$container = $("#sweep-password");
    self.$validationMessage = $("#sweep-password-validation-message");
    self.$passwordInput = $("#sweep-password-input");
    self.$nextButton = $("#sweep-password-next-button");
    self.$spinner = self.$container.find('.spinner-container');
    self.$contents = $("#sweep-password-contents");

    self.$nextButton.click(function(e) {
      e.preventDefault();
      self.trigger('nextButton.click');
    });
  }

  SweepPasswordView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SweepPasswordView.prototype.hide = function() {
    this.$container.hide();
    this.clearValidations();
    this.$passwordInput.val('');
    this.doneLoading();
  };

  SweepPasswordView.prototype.validationMessage = function(message) {
    this.$validationMessage.text(message);
  };

  SweepPasswordView.prototype.clearValidations = function() {
    this.$validationMessage.text('');
  };

  SweepPasswordView.prototype.loading = function() {
    this.$spinner.show();
    this.$contents.hide();
    this.$passwordInput.prop('disabled', true);
    this.$nextButton.button('loading');
    this.clearValidations();
  };

  SweepPasswordView.prototype.doneLoading = function() {
    this.$spinner.hide();
    this.$contents.show();
    this.$passwordInput.prop('disabled', false);
    this.$nextButton.button('reset');
  };

  MicroEvent.mixin(SweepPasswordView);
  Views.sweepPasswordView = new SweepPasswordView();
})(jQuery, CoinPocketApp.Views);

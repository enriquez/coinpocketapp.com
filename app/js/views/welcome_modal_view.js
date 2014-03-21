(function($, Views) {

  function WelcomeModalView() {
    var self = this;

    self.$container = $("#myModal");
    self.$passwordInput = $("#password");
    self.$passwordConfirmationInput = $("#password-confirmation");
    self.$submitButton = $("#welcome-modal-continue");
    self.$form = $("#welcome-modal-form");
    self.$passwordGroup = $("#welcome-modal-password-group");
    self.$passwordConfirmationGroup = $("#welcome-modal-password-confirmation-group");
    self.$validationMessage = $("#welcome-modal-validation-message");
    self.$entropyProgress = $("#welcome-modal-entropy");

    self.$passwordInput.change(function() {
      self.trigger('passwordInput.change', self.$passwordInput);
    });

    self.$passwordConfirmationInput.change(function() {
      self.trigger('passwordConfirmationInput.change', self.$passwordConfirmationInput);
    });

    self.$submitButton.click(function() {
      self.trigger('submitButton.click', self.$form);
    });
  }

  WelcomeModalView.prototype.show = function() {
    this.$container.modal({
      backdrop: 'static',
      keyboard: false
    });
  };

  WelcomeModalView.prototype.hide = function() {
    this.$container.modal('hide');
  };

  WelcomeModalView.prototype.validationMessage = function(message) {
    this.$validationMessage.text(message);
  };

  WelcomeModalView.prototype.clearValidations = function() {
    this.$validationMessage.text("");
    this.$passwordGroup.removeClass("has-error");
    this.$passwordConfirmationGroup.removeClass("has-error");
  };

  WelcomeModalView.prototype.invalidPasswordInput = function() {
    this.$passwordGroup.addClass("has-error");
  };

  WelcomeModalView.prototype.invalidPasswordConfirmationInput = function() {
    this.$passwordConfirmationGroup.addClass("has-error");
  };

  WelcomeModalView.prototype.updateEntropyProgress = function(progress) {
    var percent = Math.ceil(progress * 100).toString() + "%";
    this.$entropyProgress.width(percent);
  };

  WelcomeModalView.prototype.entropySeeded = function() {
    this.$entropyProgress.width("100%");
    this.$entropyProgress.parent(".progress").removeClass("progress-striped");
    this.$entropyProgress.parent(".progress").removeClass("active");
    this.$entropyProgress.removeClass("progress-bar-info");
    this.$entropyProgress.addClass("progress-bar-success");
    this.$entropyProgress.children("span").text("DONE!");
  };

  WelcomeModalView.prototype.loading = function() {
    this.$passwordInput.prop('disabled', true);
    this.$passwordConfirmationInput.prop('disabled', true);
    this.$submitButton.button('loading');
  };

  WelcomeModalView.prototype.clearFields = function() {
    this.$passwordInput.val('');
    this.$passwordConfirmationInput.val('');
  };

  MicroEvent.mixin(WelcomeModalView);
  Views.welcomeModalView = new WelcomeModalView();

})(jQuery, CoinPocketApp.Views);

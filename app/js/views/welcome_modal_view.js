(function($, Views) {
  var $container = $("#myModal"),
      $passwordInput = $("#password"),
      $passwordConfirmationInput = $("#password-confirmation"),
      $submitButton = $("#welcome-modal-continue"),
      $form = $("#welcome-modal-form"),
      $passwordGroup = $("#welcome-modal-password-group"),
      $passwordConfirmationGroup = $("#welcome-modal-password-confirmation-group"),
      $validationMessage = $("#welcome-modal-validation-message"),
      $entropyProgress = $("#welcome-modal-entropy");

  var self = Views.WelcomeModalView = function() {
    var self = this;

    $passwordInput.change(function() {
      self.trigger('passwordInput.change', $passwordInput);
    });

    $passwordConfirmationInput.change(function() {
      self.trigger('passwordConfirmationInput.change', $passwordConfirmationInput);
    });

    $submitButton.click(function() {
      self.trigger('submitButton.click', $form);
    });

  };

  MicroEvent.mixin(Views.WelcomeModalView);

  self.prototype.show = function() {
    $container.modal({
      backdrop: 'static',
      keyboard: false
    });
  };

  self.prototype.hide = function() {
    $container.modal('hide');
  };

  self.prototype.validationMessage = function(message) {
    $validationMessage.text(message);
  };

  self.prototype.clearValidations = function() {
    $validationMessage.text("");
    $passwordGroup.removeClass("has-error");
    $passwordConfirmationGroup.removeClass("has-error");
  };

  self.prototype.invalidPasswordInput = function() {
    $passwordGroup.addClass("has-error");
  };

  self.prototype.invalidPasswordConfirmationInput = function() {
    $passwordConfirmationGroup.addClass("has-error");
  };

  self.prototype.updateEntropyProgress = function(progress) {
    var percent = Math.ceil(progress * 100).toString() + "%";
    $entropyProgress.width(percent);
  };

  self.prototype.entropySeeded = function() {
    $entropyProgress.width("100%");
    $entropyProgress.parent(".progress").removeClass("progress-striped");
    $entropyProgress.parent(".progress").removeClass("active");
    $entropyProgress.removeClass("progress-bar-info");
    $entropyProgress.addClass("progress-bar-success");
    $entropyProgress.children("span").text("DONE!");
  };

})(jQuery, CoinPocketApp.Views);

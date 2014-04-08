(function(entropy, keyPair, browser, welcomeModalView, Controllers) {

  function WelcomeModalController() {
    var self = this;

    self.passwordInputValue = '';
    self.passwordConfirmationValue = '';

    if (keyPair.isGenerated) {
      entropy.addCryptoStrongEntropy();
    } else {
      welcomeModalView.show();

      if (!browser.hasCryptoGetRandomValues()) {
        welcomeModalView.showUnsupportedMessage("A secure random number generator is not present. Try again in Safari, Chrome, or Firefox.");
      }

      welcomeModalView.bind("passwordInput.change", self.passwordInputChanged);
      welcomeModalView.bind("passwordConfirmationInput.change", self.passwordConfirmationInputChanged);
      welcomeModalView.bind("submitButton.click", self.submitButtonClicked);

      self.updateEntropyLevel(entropy.progress);
      entropy.bind('entropy.progress', self.updateEntropyLevel);
      entropy.bind('entropy.seeded', self.entropySeeded);
    }
  }

  WelcomeModalController.prototype.passwordInputChanged = function($passwordInput) {
    this.passwordInputValue = $passwordInput.val();
  };

  WelcomeModalController.prototype.passwordConfirmationInputChanged = function($passwordConfirmationInput) {
    this.passwordConfirmationValue = $passwordConfirmationInput.val();
  };

  WelcomeModalController.prototype.submitButtonClicked = function($form) {
    var self = this;

    welcomeModalView.clearValidations();

    if (!self.passwordInputValue) {
      welcomeModalView.validationMessage("Password can't be blank");
      welcomeModalView.invalidPasswordInput();
    } else if (self.passwordInputValue !== self.passwordConfirmationValue) {
      welcomeModalView.validationMessage("Passwords don't match");
      welcomeModalView.invalidPasswordConfirmationInput();
    } else if (self.passwordInputValue.length < 4) {
      welcomeModalView.validationMessage("Password must be more than 4 characters");
      welcomeModalView.invalidPasswordInput();
    } else if (entropy.progress() < 1.0) {
      welcomeModalView.validationMessage("Need more Entropy");
    } else {
      welcomeModalView.loading();
      keyPair.generate(self.passwordInputValue, function() {
        welcomeModalView.hide();
        welcomeModalView.clearFields();
        self.passwordInputValue = '';
        self.passwordConfirmationValue = '';
      });
    }
  };

  WelcomeModalController.prototype.updateEntropyLevel = function(progress) {
    welcomeModalView.updateEntropyProgress(progress);
  };

  WelcomeModalController.prototype.entropySeeded = function() {
    entropy.addCryptoStrongEntropy();
    welcomeModalView.entropySeeded();
    entropy.unbind('entropy.progress');
    entropy.unbind('entropy.seeded');
  };

  Controllers.welcomeModalController = new WelcomeModalController();

})(CoinPocketApp.Models.entropy, CoinPocketApp.Models.keyPair, CoinPocketApp.Models.browser, CoinPocketApp.Views.welcomeModalView, CoinPocketApp.Controllers);

(function(CoinPocketApp) {

  if (!CoinPocketApp.Models.KeyPair.hasKeyPair()) {

    var self = CoinPocketApp.Controllers.WelcomeModalController = {
      view: new CoinPocketApp.Views.WelcomeModalView(),
      entropy: new CoinPocketApp.Models.Entropy(),
      passwordInputValue: '',
      passwordConfirmationValue: '',
      passwordInputChanged: function($passwordInput) {
        self.passwordInputValue = $passwordInput.val();
      },
      passwordConfirmationInputChanged: function($passwordConfirmationInput) {
        self.passwordConfirmationValue = $passwordConfirmationInput.val();
      },
      submitButtonClicked: function($form) {
        self.view.clearValidations();

        if (!self.passwordInputValue) {
          self.view.validationMessage("Password can't be blank");
          self.view.invalidPasswordInput();
        } else if (self.passwordInputValue !== self.passwordConfirmationValue) {
          self.view.validationMessage("Passwords don't match");
          self.view.invalidPasswordConfirmationInput();
        } else if (self.entropy.progress() < 1.0) {
          self.view.validationMessage("Need more Entropy");
        } else {
          self.view.hide();
          CoinPocketApp.Models.KeyPair.generate(self.passwordInputValue);
        }
      },
      updateEntropyLevel: function(progress) {
        self.view.updateEntropyProgress(progress);
      },
      entropySeeded: function() {
        self.view.entropySeeded();
        self.entropy.unbind('entropy.progress');
        self.entropy.unbind('entropy.seeded');
      }
    };

    self.view.show();

    self.view.bind("passwordInput.change",
                      self.passwordInputChanged);
    self.view.bind("passwordConfirmationInput.change",
                      self.passwordConfirmationInputChanged);
    self.view.bind("submitButton.click",
                      self.submitButtonClicked);

    self.updateEntropyLevel(self.entropy.progress);
    self.entropy.bind('entropy.progress', self.updateEntropyLevel);
    self.entropy.bind('entropy.seeded', self.entropySeeded);

  }

})(CoinPocketApp);

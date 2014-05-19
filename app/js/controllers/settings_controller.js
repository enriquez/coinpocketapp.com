(function(pageHash, conversionRate, keyPair, settingsView, Controllers) {

  function SettingsController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);

    settingsView.bind('conversionRate.clicked', function(source) {
      conversionRate.setSelectedRate(source);
    });

    settingsView.listConversionRates(conversionRate.rates);

    var sweepURL = document.location.protocol + "//" + document.location.host + "/#/sweep?code=" + encodeURIComponent(keyPair.encryptedPrivateKeyExponent);

    settingsView.setPrivateKeyEmailBody("Coin Pocket Encrypted Private Key",
      "The contents of this email can be used to spend your Bitcoin. Do not share it with anyone you don't trust." + "\n" +
      "\n" +
      "Bitcoin Address:" + "\n" +
      keyPair.bitcoinAddress + "\n" +
      "\n" +
      "Private Key (Coin Pocket Format):" + "\n" +
      encodeURIComponent(keyPair.encryptedPrivateKeyExponent) + "\n" +
      "\n" +
      "Note: The private key is encrypted with the password you used when you setup Coin Pocket. YOU MUST KNOW THE PASSWORD in order to access the funds." + "\n" +
      "\n" +
      "Use the link below to sweep the funds from this address into a new Coin Pocket address" + "\n" +
      sweepURL
    );
  }

  SettingsController.prototype.showOrHide = function(pageParams) {
    if (pageParams.page === '#/settings') {
      conversionRate.fetchRates(function() {
        settingsView.listConversionRates(conversionRate.rates, conversionRate.selectedRateSource);
      });
      settingsView.show();
    } else {
      settingsView.hide();
    }
  };

  Controllers.settingsController = new SettingsController();
})(CoinPocketApp.Models.pageHash, CoinPocketApp.Models.conversionRate, CoinPocketApp.Models.keyPair, CoinPocketApp.Views.settingsView, CoinPocketApp.Controllers);

(function(pageHash, conversionRate, keyPair, settingsView, Controllers) {

  function SettingsController() {
    this.showOrHide(pageHash.currentPage);
    pageHash.bind('pageHash.pageChanged', this.showOrHide);

    settingsView.bind('conversionRate.clicked', function(source) {
      conversionRate.setSelectedRate(source);
    });

    settingsView.listConversionRates(conversionRate.rates);
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

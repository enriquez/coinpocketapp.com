(function($, Views) {

  function SettingsView() {
    var self = this;
    self.$container = $("#settings");
    self.$conversionRates = $("#conversion-rates");
    self.$emailPrivateKeyButton = $("#email-private-key");

    self._linkClicked = function(e) {
      e.preventDefault();
      self.$conversionRates.find('a').removeClass('active');
      $(this).addClass('active');
      self.trigger('conversionRate.clicked', $(this).data('source'));
    };
  }

  SettingsView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SettingsView.prototype.hide = function() {
    this.$container.hide();
  };

  SettingsView.prototype.listConversionRates = function(rates, currentRateSource) {
    var self = this;

    self.$conversionRates.empty();

    for (var i=0; i<rates.length; i++) {
      var rate = rates[i];
      var text = '';
      var link = $('<a>').attr({ 'href': '#', 'class': 'list-group-item' });

      if (rate.source === currentRateSource) {
        link.addClass('active');
      }

      if (rate.rate) {
        text += rate.format.replace("%d", rate.rate);
      }

      if (rate.name) {
        text += ' ' + rate.name;
      }

      link.text(text);

      link.data('source', rate.source);

      link.click(self._linkClicked);

      self.$conversionRates.append(link);
    }

  };

  SettingsView.prototype.setPrivateKeyEmailBody = function(subject, body) {
    this.$emailPrivateKeyButton.attr('href', 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
  };

  MicroEvent.mixin(SettingsView);
  Views.settingsView = new SettingsView();
})(jQuery, CoinPocketApp.Views);

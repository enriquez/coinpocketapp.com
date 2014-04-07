(function($, Models) {

  function ConversionRate() {
    var self = this;

    if (!self.restoreFromStore()) {
      // set defaults
      self.selectedRateSource = 'usd-coinbase-sell';
      self.selectedUnits = 'btc';
      self.rates = [
        { rate: undefined, format: "$%d", source: 'usd-coinbase-sell', name: "Coinbase Sell Price" },
        { rate: undefined, format: "$%d", source: 'usd-bitpay-bbb', name: "Bitpay (Bitcoin Best Bid)" },
        { rate: undefined, format: "$%d", source: 'usd-coindesk', name: "CoinDesk Bitcoin Price Index" }
      ];
    }

    self.updateSource(self.selectedRateSource, function() { });
  }

  ConversionRate.prototype.saveToStore = function() {
    var self = this;

    localStorage.setItem('conversationRateStore', JSON.stringify({
      rates: self.rates,
      selectedRateSource: self.selectedRateSource,
      selectedUnits: self.selectedUnits
    }));
  };

  ConversionRate.prototype.restoreFromStore = function() {
    var self = this;
        conversationRateStore = localStorage.getItem('conversationRateStore');

    if (conversationRateStore) {
      var conversionRateData = JSON.parse(conversationRateStore);
      self.rates = conversionRateData.rates;
      self.selectedRateSource = conversionRateData.selectedRateSource;
      self.selectedUnits = conversionRateData.selectedUnits;

      return true;
    } else {
      return false;
    }
  };

  ConversionRate.prototype.fetchRates = function(hollaback) {
    var self = this;

    for (var i=0;i<self.rates.length;i++) {
      var rate = self.rates[i];
      self.updateSource(rate.source, hollaback);
    }
  };

  ConversionRate.prototype.updateSource = function(source, hollaback) {
    if (source === 'usd-coinbase-sell') {
      this.updateCoinbase(hollaback);
    } else if (source === 'usd-bitpay-bbb') {
      this.updateBitpay(hollaback);
    } else if (source === 'usd-coindesk') {
      this.updateCoinDesk(hollaback);
    } else {
      hollaback();
    }
  };

  ConversionRate.prototype.updateCoinbase = function(hollaback) {
    var self = this;
    var url = 'https://coinbase.com/api/v1/prices/sell?callback=?';
    $.getJSON(url, function(data) {
      if (data && data.subtotal && data.subtotal.amount) {
        // this price is what you would pay with fees for 1 BTC
        var price = data.subtotal.amount;
        self.rates[0].rate = price;
        hollaback(price);
        self.triggerSelectedRateUpdate(self.rates[0]);
        self.saveToStore();
      } else {
        hollaback();
      }
    });
  };

  ConversionRate.prototype.updateBitpay = function(hollaback) {
    var self = this;
    var url = 'https://bitpay.com/api/rates?cors=true';
    $.getJSON(url, function(data) {
      if (data && data[0] && data[0].code === 'USD') {
        var price = data[0].rate;
        self.rates[1].rate = price;
        hollaback(price);
        self.triggerSelectedRateUpdate(self.rates[1]);
        self.saveToStore();
      } else {
        hollaback();
      }
    });
  };

  ConversionRate.prototype.updateCoinDesk = function(hollaback) {
    var self = this;
    var url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    $.getJSON(url, function(data) {
      if (data && data.bpi && data.bpi.USD && data.bpi.USD.rate_float) {
        var price = data.bpi.USD.rate_float;
        self.rates[2].rate = price;
        hollaback(price);
        self.triggerSelectedRateUpdate(self.rates[2]);
        self.saveToStore();
      } else {
        hollaback();
      }
    });
  };

  ConversionRate.prototype.setSelectedRate = function(source) {
    var newRate;
    for (var i=0; i<this.rates.length; i++) {
      if (this.rates[i].source === source) {
        newRate = this.rates[i];
      }
    }

    if (newRate) {
      this.selectedRateSource = source;
      this.saveToStore();
      this.triggerSelectedRateUpdate(newRate);
    }
  };

  ConversionRate.prototype.triggerSelectedRateUpdate = function(rate) {
    if (rate.source === this.selectedRateSource) {
      this.trigger('selectedRateSource.updated', rate.rate);
    }
  };

  ConversionRate.prototype.toggleSelectedUnits = function() {
    if (this.selectedUnits === 'btc') {
      this.selectedUnits = 'usd';
    } else {
      this.selectedUnits = 'btc';
    }

    this.trigger('selectedUnits.updated', this.selectedUnits);
    this.saveToStore();
  };

  ConversionRate.prototype.current = function() {
    if (this.selectedUnits === 'btc') {
      return { rate: 1, units: 'btc' };
    } else {
      for (var i=0; i<this.rates.length; i++) {
        var rate = this.rates[i];
        if (rate.source === this.selectedRateSource) {
          return { rate: rate.rate, units: 'usd' };
        }
      }
    }

    return null;
  };

  ConversionRate.prototype.selectedRate = function() {
    for (var i=0; i<this.rates.length; i++) {
      var rate = this.rates[i];
      if (rate.source === this.selectedRateSource) {
        return rate.rate;
      }
    }

    return null;
  };

  MicroEvent.mixin(ConversionRate);
  Models.conversionRate = new ConversionRate();
})(jQuery, CoinPocketApp.Models);

(function($, Views) {

  function BalanceView() {
    var self = this;
    self.$container = $("#balance");
    self.$balance = self.$container.find('[data-btc]');

    self.$container.click(function(e) {
      e.preventDefault();
      self.trigger('balance.clicked');
    });
  }

  BalanceView.prototype.setBalance = function(balance) {
    this.$balance.data('btc', balance);
    this.$balance.formatBTC();
  };

  BalanceView.prototype.setUnits = function(rate, units) {
    this.$balance.data('rate', rate);
    this.$balance.data('units', units);
    this.$balance.formatBTC();
  };

  MicroEvent.mixin(BalanceView);
  Views.balanceView = new BalanceView();

})(jQuery, CoinPocketApp.Views);

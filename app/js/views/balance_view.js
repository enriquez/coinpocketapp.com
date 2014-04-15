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
    this.balanceIsSet = true;
  };

  BalanceView.prototype.setUnits = function(rate, units) {
    this.$balance.data('rate', rate);
    this.$balance.data('units', units);
    if (this.balanceIsSet) {
      this.$balance.formatBTC();
    }
  };

  MicroEvent.mixin(BalanceView);
  Views.balanceView = new BalanceView();

})(jQuery, CoinPocketApp.Views);

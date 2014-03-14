(function($, Views) {

  function BalanceView() {
    this.$container = $("#balance");
  }

  BalanceView.prototype.setBalance = function(balance) {
    var $element = this.$container.find('[data-btc]');
    $element.data('btc', balance);
    $element.formatBTC();
  }

  Views.balanceView = new BalanceView();

})(jQuery, CoinPocketApp.Views);

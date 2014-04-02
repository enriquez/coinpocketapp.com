(function($, Views) {

  function ConnectionStatusView() {
    this.$container = $("#connection-status");
  }

  ConnectionStatusView.prototype.showFailure = function() {
    this.$container.show();
  };

  ConnectionStatusView.prototype.hide = function() {
    this.$container.hide();
  };

  Views.connectionStatusView = new ConnectionStatusView();
})(jQuery, CoinPocketApp.Views);

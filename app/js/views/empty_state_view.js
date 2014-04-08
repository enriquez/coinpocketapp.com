(function($, Views) {

  function EmptyStateView() {
    this.$container = $("#empty-state");
    this.$receiveAddress = $("#empty-state-receive-address");
  }

  EmptyStateView.prototype.hide = function() {
    this.$container.hide();
  };

  EmptyStateView.prototype.setReceiveAddress = function(address) {
    this.$receiveAddress.text(address);
  };

  Views.emptyStateView = new EmptyStateView();

})(jQuery, CoinPocketApp.Views);

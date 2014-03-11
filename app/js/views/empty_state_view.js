(function($, Views) {

  function EmptyStateView() {
    this.$container = $("#empty-state");
  }

  EmptyStateView.prototype.hide = function() {
    this.$container.hide();
  };

  Views.emptyStateView = new EmptyStateView();

})(jQuery, CoinPocketApp.Views);

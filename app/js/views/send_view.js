(function($, Views) {

  function SendView() {
    this.$container = $("#send");
  }

  SendView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SendView.prototype.hide = function() {
    this.$container.hide();
  };

  Views.sendView = new SendView();
})(jQuery, CoinPocketApp.Views);

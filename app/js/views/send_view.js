(function($, Views) {

  function SendView() {
    this.$container = $("#send");
    this.$address = $("#address");
    this.$amount = $("#amount");

    $("#scancode-button").scancode();
  }

  SendView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SendView.prototype.hide = function() {
    this.$container.hide();
  };

  SendView.prototype.setAddress = function(address) {
    this.$address.val(address);
  };

  SendView.prototype.setAmount = function(amount) {
    this.$amount.val(amount);
  };

  Views.sendView = new SendView();
})(jQuery, CoinPocketApp.Views);

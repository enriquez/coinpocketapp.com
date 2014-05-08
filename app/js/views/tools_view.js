(function($, Views) {

  function ToolsView() {
    this.$container = $("#tools");
    this.$address = $("#address-check");
    this.$amount = $("#amount-check");
    this.$sendBackupButton = $("#send-backup-button");
    $("#scancode-button-check").scancode();
  }

  ToolsView.prototype.show = function() {
    this.$container.fadeIn();
  };

  ToolsView.prototype.hide = function() {
    this.$container.hide();
  };

  ToolsView.prototype.setAddress = function(address) {
    this.$address.val(address);
  };

  ToolsView.prototype.setAmount = function(amount) {
    this.$amount.val(amount);
  };

  MicroEvent.mixin(ToolsView);
  Views.toolsView = new ToolsView();

})(jQuery, CoinPocketApp.Views);

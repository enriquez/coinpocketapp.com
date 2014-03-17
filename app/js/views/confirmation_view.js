(function($, Views) {

  function ConfirmationView() {
    this.$container = $("#confirmation");
  }

  ConfirmationView.prototype.show = function() {
    this.$container.fadeIn();
  };

  ConfirmationView.prototype.hide = function() {
    this.$container.hide();
  };

  Views.confirmationView= new ConfirmationView();
})(jQuery, CoinPocketApp.Views);

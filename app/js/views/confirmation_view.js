(function($, Views) {

  function ConfirmationView() {
    var self = this;

    self.$container = $("#confirmation");
    self.$form = $("#confirmation-form");
    self.$passwordInput = $("#confirmation-password");
    self.$sendButton = $("#confirmation-send-button");

    self.$sendButton.click(function() {
      self.trigger('sendButton.click', self.$form);
    });
  }

  ConfirmationView.prototype.show = function() {
    this.$container.fadeIn();
  };

  ConfirmationView.prototype.hide = function() {
    this.$container.hide();
  };

  MicroEvent.mixin(ConfirmationView);

  Views.confirmationView = new ConfirmationView();
})(jQuery, CoinPocketApp.Views);

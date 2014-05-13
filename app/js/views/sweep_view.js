(function($, Views) {

  function SweepView() {
    var self = this;

    self.$container = $("#sweep");
    self.$nextButton = $("#sweep-next-button");
    self.$privateKeyInput = $("#private-key");
    self.$privateKeyGroup = $("#private-key-group");
    self.$scancode = $("#sweep-scancode");
    self.$validationMessage = $("#sweep-validation-message");

    self.$container.find("[data-scancode-callback-path]").scancode();

    self.$nextButton.click(function(e) {
      e.preventDefault();
      self.trigger('nextButton.click');
    });
  }

  SweepView.prototype.show = function() {
    this.$container.fadeIn();
  };

  SweepView.prototype.hide = function() {
    this.$container.hide();
  };

  SweepView.prototype.showScanCode = function() {
    this.$scancode.show();
  };

  SweepView.prototype.hideScanCode = function() {
    this.$scancode.hide();
  };

  SweepView.prototype.validationMessage = function(message) {
    this.$validationMessage.text(message);
  };

  SweepView.prototype.clearValidations = function() {
    this.$validationMessage.text("");
    this.$privateKeyGroup.removeClass('has-error');
  };

  SweepView.prototype.invalidPrivateKey = function() {
    this.$privateKeyGroup.addClass('has-error');
  };

  SweepView.prototype.setPrivateKey = function(text) {
    this.$privateKeyInput.val(text);
  };

  MicroEvent.mixin(SweepView);
  Views.sweepView = new SweepView();
})(jQuery, CoinPocketApp.Views);

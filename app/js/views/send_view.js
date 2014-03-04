(function($, Views) {

  var $container = $("#send");

  var self = Views.SendView = function() { };

  self.prototype.show = function() {
    $container.fadeIn();
  };

  self.prototype.hide = function() {
    $container.hide();
  };

})(jQuery, CoinPocketApp.Views);

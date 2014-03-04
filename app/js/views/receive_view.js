(function($, Views) {

  var $container = $("#receive");

  var self = Views.ReceiveView = function() { };

  self.prototype.show = function() {
    $container.fadeIn();
  };

  self.prototype.hide = function() {
    $container.hide();
  };

})(jQuery, CoinPocketApp.Views);

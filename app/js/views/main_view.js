(function($, Views) {

  var $container = $("#main");

  var self = Views.MainView = function() { };

  self.prototype.show = function() {
    $container.fadeIn();
  };

  self.prototype.hide = function() {
    $container.hide();
  };

})(jQuery, CoinPocketApp.Views);

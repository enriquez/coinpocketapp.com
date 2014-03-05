(function($, QRCode, Views) {

  var $container = $("#receive"),
      $receiveAddress = $("#receive-address"),
      $smsButton = $("#sms-button"),
      $emailButton = $("#email-button");

  var self = Views.ReceiveView = function() { };

  self.prototype.show = function() {
    $container.fadeIn();
  };

  self.prototype.hide = function() {
    $container.hide();
  };

  self.prototype.setAddress = function(address) {
    new QRCode(document.getElementById("qrcode"), address);
    $receiveAddress.text(address);
    $smsButton.attr('href', 'sms:;body=' + address);
    $emailButton.attr('href', 'mailto:?body=' + address);
  };

})(jQuery, QRCode, CoinPocketApp.Views);

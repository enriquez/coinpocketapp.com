(function($, Views) {

  function ViewPrivateKeyView() {
    var self = this;
    self.$container = $('#view-private-key');
    self.$bip38 = $('#bip38-private-key');
    self.$bip38qrCode = $('#bip38-qrcode');
    self.$emailButton = $('#view-private-key-email-button');
    self.$printButton = $('#view-private-key-print-button');
    self.$spinner = self.$container.find('.spinner-container');

    self.$printButton.click(function(e) {
      e.preventDefault();
      window.print();
    });
  }

  ViewPrivateKeyView.prototype.show = function() {
    this.$spinner.show();
    this.$container.find('.view-private-key-contents').hide();
    this.$container.fadeIn();
  };

  ViewPrivateKeyView.prototype.hide = function() {
    this.$container.hide();
    this.$bip38.text('');
    this.$emailButton.attr('href', '');
    this.$bip38qrCode.empty();
  };

  ViewPrivateKeyView.prototype.setPrivateKey = function(privateKey) {
    new QRCode(document.getElementById("bip38-qrcode"), privateKey);
    this.$bip38.text(privateKey);

    var subject = encodeURIComponent('Coin Pocket Encrypted Private Key');
    var body    = 'Below is your encrypted private key in BIP38 format.\n' +
                  privateKey + '\n' +
                  '\n' +
                  'DO NOT FORGET YOUR PASSWORD. You will need both your password and encrypted private key to spend your Bitcoin.\n' +
                  '\n' +
                  'Follow the URL below to sweep the balance into a new Coin Pocket address.\n' + 
                  document.location.protocol + '//' + document.location.host + '/#/sweep?code=' + privateKey;
    this.$emailButton.attr('href', 'mailto:?subject=' + subject + '&body=' + encodeURIComponent(body));

    this.$spinner.hide();
    this.$container.find('.view-private-key-contents').show();
  };

  MicroEvent.mixin(ViewPrivateKeyView);
  Views.viewPrivateKeyView = new ViewPrivateKeyView();
})(jQuery, CoinPocketApp.Views);

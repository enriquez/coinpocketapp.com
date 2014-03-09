(function($) {

  $.fn.formatBTC = function(options) {

    return this.each(function() {
      var btc = $(this).data('btc');

      if (btc < 0) {
        btc = btc * -1;
      }

      $(this).text(btc.toString() + " BTC");
    });
  };

})(jQuery);
